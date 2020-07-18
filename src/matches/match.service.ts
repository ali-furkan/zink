import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "./match.entity";
import { User } from "../users/user.entity";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Match,
    @InjectRepository(User)
    private userRepository: User,
  ) {}
}
