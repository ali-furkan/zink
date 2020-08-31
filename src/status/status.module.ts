import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatusController } from "./status.controller";
import { StatusService } from "./status.service";
import { UsersModule } from "src/users/user.module";
import { UserEntity } from "src/users/user.entity";
import { MatchEntity } from "src/matches/match.entity";

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
