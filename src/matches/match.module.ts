import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { User } from "../users/user.entity";
import { Match } from "../matches/match.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Match, User])],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [TypeOrmModule],
})
export class MatchModule {}
