import { Controller, Body, Post, Get, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { SignupDto } from "./dto/signup.dto";
import { AuthorizeDto } from "./dto/authorize.dto";
import { AuthService } from "./auth.service";
import { IResponse } from "src/@types/Response/Response";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { AuthGuard } from "./auth.guard";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signup(@Body() userBody: SignupDto): any {
    return this.authService.signup(userBody);
  }

  @Post("/authorize")
  async authorize(
    @Body() authBody: AuthorizeDto,
  ): Promise<IResponse | GenerateTokenDto> {
    return await this.authService.authorize(authBody);
  }

  @UseGuards(AuthGuard)
  @Get("/whoami")
  whoami(@Req() req: Request): any {
    return req.user;
  }
}
