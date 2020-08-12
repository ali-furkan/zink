import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { UserEntity } from "src/users/user.entity";
import { TResponse } from "src/@types/Response/Response";
import { InjectRepository } from "@nestjs/typeorm";
import * as os from "os";
import { GetUserDto } from "./dto/get-user.dto";
import { MatchEntity } from "src/matches/match.entity";
import { GetMatchDto } from "./dto/get-match.dto";
import * as cache from "memory-cache";

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: MongoRepository<UserEntity>,
        @InjectRepository(MatchEntity)
        private matchRepository: MongoRepository<MatchEntity>,
    ) {}

}
