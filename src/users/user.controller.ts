import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./user.service";
import { User } from "./user.entity";

@Controller("/user")
export class UserController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/users")
  async getUser(): Promise<User[]> {
    return await this.userService.getUsers();
  }
}
