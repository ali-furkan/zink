import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { UserEntity } from "src/users/user.entity";
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

    getInfo(): Zink.Response {
        const time = process.hrtime(cache.get("req.time"));
        return {
            region: "eu",
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                usage: 1 - os.freemem() / os.totalmem(),
            },
            var: time[0] * 10 ** 9 + time[1],
            uptime: os.uptime(),
        };
    }

    async getUsers({ begin, length, id }: GetUserDto): Promise<Zink.Response> {
        if (id) {
            const user = await this.userRepository.findOne({ id });
            if (!user) throw new NotFoundException({ id }, "User Not Found");
            return user;
        }
        const users = await this.userRepository.find({
            skip: begin,
            take: length,
        });
        return users;
    }

    async getMatches({
        status,
        begin,
        length,
        id,
    }: GetMatchDto): Promise<Zink.Response> {
        if (id) {
            const match = await this.matchRepository.findOne({ id });
            if (!match) throw new NotFoundException({ id }, "Match Not Found");
            return match;
        }
        const matches = await this.matchRepository.find({
            skip: begin,
            take: length,
            status,
        });
        return matches;
    }
    async getHosting(): Promise<Zink.Response> {
        return;
    }
}
