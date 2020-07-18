import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
