import { Controller, Body, Post, Get, UseGuards } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { AuthorizeDto } from "./dto/authorize.dto";
import { AuthService } from "./auth.service";
import { IResponse } from "src/@types/Response/Response";
import { GenerateTokenDto } from "./dto/generate-token.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "src/users/user.decorator";
import { ReqUser } from "src/@types/User/ReqUser";
import { RateLimit } from "nestjs-rate-limit";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @RateLimit({ points: 10, duration: 60 * 60 })
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
    whoami(@User() user: ReqUser): ReqUser {
        return user;
    }
}
