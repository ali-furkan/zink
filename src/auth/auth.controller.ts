import { Controller, Body, Post, Get, UseGuards, Req } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { AuthorizeDto } from "./dto/authorize.dto";
import { AuthService } from "./auth.service";
import { IResponse } from "src/@types/Response/Response";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { AuthGuard } from "./auth.guard";
import { Nest } from "src/@types/augmentation";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  async signup(@Body() userBody: SignupDto): Promise<IResponse> {
    return await this.authService.signup(userBody);
  }

  @Post("/authorize")
  async authorize(
    @Body() authBody: AuthorizeDto,
  ): Promise<IResponse | GenerateTokenDto> {
    return await this.authService.authorize(authBody);
  }

  @UseGuards(AuthGuard)
  @Get("/whoami")
  whoami(@Req() req: Nest.Request): any {
    return req.user;
  }
}
