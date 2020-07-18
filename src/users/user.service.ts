import * as argon2 from "argon2";
import { MongoRepository } from "typeorm";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { SnowflakeFactory, Flag, Type } from "../libs/snowflake";
import { AuthService } from "src/auth/auth.service";
import { IResponse } from "src/@types/Response/Response";
import { GenerateTokenDto } from "src/auth/dto/generate-token.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  private snowflake = new SnowflakeFactory([Flag.ACTIVE_USER], Type.USER);

  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async isCorrectPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IResponse & { user?: User }> {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      return { statusCode: 404, err: { message: "User Not Found", code: 404 } };
    const verify = await argon2.verify(user.password, password);
    if (!verify)
      return { statusCode: 401, err: { message: "Incorrect Password" } };
    return { user };
  }

  async isUnique({ email }: { email: string }): Promise<boolean> {
    const matchUsers = await this.userRepository.count({ email });
    return matchUsers === 0;
  }

  async createUser({
    username,
    email,
    password,
  }: CreateUserDto): Promise<IResponse | GenerateTokenDto> {
    const isUnique = await this.isUnique({ email });
    if (!isUnique)
      return {
        statusCode: 409,
        err: { code: 409, message: "This email is already using " },
      };
    const hash = await argon2.hash(password);
    const id = await this.snowflake.next();
    const { access_token, expires_in } = this.authService.generateToken({
      email,
      id,
    });
    const user = this.userRepository.create({
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
}
