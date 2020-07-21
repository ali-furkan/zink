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
import { TResponse } from "src/@types/Response/Response";
import { User } from "./user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { ReqUser } from "src/@types/User/ReqUser";
import { PatchUserDto } from "./dto/patch-user.dto";

@Controller("/users")
export class UserController {
  constructor(private userService: UsersService) {}

  @Get("/@me")
  @UseGuards(AuthGuard)
  async getMyData(@User() user: ReqUser): Promise<TResponse> {
    return await this.userService.getUserData(user);
  }

  @Patch("/@me")
  @UseGuards(AuthGuard)
  async editMyData(
    @User() user: ReqUser,
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
  async getUserData(@Param("id") id: string): Promise<TResponse> {
    return await this.userService.getUserData({ id: parseInt(id) });
  }
}
