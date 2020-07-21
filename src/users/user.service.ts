import * as argon2 from "argon2";
import { MongoRepository } from "typeorm";
import { Injectable, Inject, forwardRef, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { SnowflakeFactory, Flag, Type } from "../libs/snowflake";
import { AuthService } from "src/auth/auth.service";
import { TResponse } from "src/@types/Response/Response";
import { GenerateTokenDto } from "src/auth/dto/generate-token.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";

@Injectable()
export class UsersService {
  private snowflake = new SnowflakeFactory([Flag.ACTIVE_USER], Type.USER);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: MongoRepository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async isCorrectPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<[HttpException|null,UserEntity?]> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      return [new NotFoundException()]
    const verify = await argon2.verify(user.password, password);
    if (!verify)
      return [new HttpException("Incorrect Password",HttpStatus.UNAUTHORIZED)]
    return [null,user];
  }

  async isUnique({ email }: { email: string }): Promise<boolean> {
    const matchUsers = await this.userRepository.count({ email });
    return matchUsers === 0;
  }

  async isExist({ id }:{[propName:string]:any}): Promise<[boolean,UserEntity]> {
    const user = await this.userRepository.findOne({id})
    return [user instanceof UserEntity,user]
  }

  async createUser({
    username,
    email,
    password,
  }: CreateUserDto): Promise<TResponse | GenerateTokenDto> {
    const isUnique = await this.isUnique({ email });
    if (!isUnique) throw new HttpException("This email is already using",HttpStatus.CONFLICT)
    const hash = await argon2.hash(password);
    const id = await this.snowflake.next();
    const { access_token, expires_in } = this.authService.generateToken({
      email,
      id,
    });
    const user = this.userRepository.create({
      id,
      username,
      email,
      password: hash,
    });

    await this.userRepository.save(user);

    return {
      message: "Successfully Signup",
      access_token,
      expires_in,
    };
  }

  async getUserData({id,email}:GetUserDto): Promise<TResponse> {
    const [isExist,user] = await this.isExist({id})
    if(!isExist) throw new HttpException("User not found",HttpStatus.NOT_FOUND)
    if(email&&user.email!==email) throw new HttpException("User not found",HttpStatus.NOT_FOUND)
    return Object.assign(user,{_id:undefined,password: undefined})
  }
}
