import {
    Controller,
    Get,
    ClassSerializerInterceptor,
    UseInterceptors,
    UseGuards,
    Param,
    Post,
    Patch,
    Body,
} from "@nestjs/common";
import { UsersService } from "./user.service";
import { User } from "./user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { PatchUserDto } from "./dto/patch-user.dto";
import { RateLimit } from "nestjs-rate-limit";

@Controller("/users")
export class UserController {
    constructor(private userService: UsersService) {}

    @Get("/@me")
    @UseGuards(AuthGuard)
    async getMyData(@User() user: Zink.RequestUser): Promise<Zink.Response> {
        return await this.userService.getUserData(user);
    }

    @RateLimit({ points: 5, duration: 5 * 60 })
    @Patch("/@me")
    @UseGuards(AuthGuard)
    async editMyData(
        @User() user: Zink.RequestUser,
        @Body() patch: PatchUserDto,
    ): Promise<any> {
        return await this.userService.editUser({ user, patch });
    }

    @Post("/@me/avatar")
    @UseGuards(AuthGuard)
    async postMyAvatar(): Promise<any> {
        return;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/id/:id")
    @UseGuards(AuthGuard)
    async getUserData(@Param("id") id: string): Promise<Zink.Response> {
        return await this.userService.getUserData({ id });
    }
}
