import * as Jwt from "jsonwebtoken";
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import Config from "src/config";
import { UsersService } from "src/users/user.service";
import { TResponse } from "src/@types/Response/Response";
import { IToken } from "src/@types/User/token";
import { AuthorizeDto } from "./dto/authorize.dto";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  generateToken = (payload: IToken): GenerateTokenDto => ({
    access_token: Jwt.sign(payload, Config().secret, {
      algorithm: "HS512",
      expiresIn: "1y",
    }),
    expires_in: 365 * 24 * 60 * 60 * 1000,
  });

  async signup(userBody: SignupDto): Promise<TResponse> {
    return await this.userService.createUser(userBody);
  }

  async authorize({
    email,
    password,
  }: AuthorizeDto): Promise<TResponse | GenerateTokenDto> {
    const [err, user] = await this.userService.isCorrectPassword({
      email,
      password,
    });
    if (err) throw err;
    const payload = {
      id: user.id,
      email: user.email,
    };
    const { access_token, expires_in } = this.generateToken(payload);
    return {
      message: "Successfully Authorize",
      access_token,
      expires_in,
    };
  }
}
