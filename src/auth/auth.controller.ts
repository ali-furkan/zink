import { Controller, Body, Post, Get, UseGuards, Query } from "@nestjs/common";
import { RateLimit } from "nestjs-rate-limit";
import { AuthService } from "./auth.service";
import { User } from "../users/user.decorator";
import { AuthGuard } from "./auth.guard";
import { AuthorizeDto } from "./dto/authorize.dto";
import { SignupDto } from "./dto/signup.dto";
import { VerifyDTO } from "./dto/verify.dto";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @RateLimit({ points: 10, duration: 60 * 60 })
    @Post("/signup")
    async signup(@Body() userBody: SignupDto): Promise<Zink.Response> {
        return await this.authService.signup(userBody);
    }

    @Post("/authorize")
    async authorize(@Body() authBody: AuthorizeDto): Promise<Zink.Response> {
        return await this.authService.authorize(authBody);
    }

    @UseGuards(AuthGuard)
    @Get("/whoami")
    whoami(@User() user: Zink.RequestUser): Zink.RequestUser {
        return user;
    }

    @Get("/verify")
    async verify(@Query() query: VerifyDTO): Promise<Zink.Response> {
        return await this.authService.verify(query.type, query.code);
    }
}
