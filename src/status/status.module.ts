import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/user.entity";
import { MatchEntity } from "src/matches/match.entity";
import { UsersModule } from "src/users/user.module";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, MatchEntity]),
        forwardRef(() => UsersModule),
    ],
    controllers: [StatusController],
    providers: [StatusService],
    exports: [TypeOrmModule],
})
export class StatusModule {}
