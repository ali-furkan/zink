import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "./match.entity";
import { UserEntity } from "../users/user.entity";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Match,
    @InjectRepository(UserEntity)
    private userRepository: UserEntity,
  ) {}
}
