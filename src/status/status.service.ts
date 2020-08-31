import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { UserEntity } from "../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as os from "os";
import { GetUserDto } from "./dto/get-user.dto";
import { MatchEntity } from "../matches/match.entity";
import { GetMatchDto } from "./dto/get-match.dto";
import * as cache from "memory-cache";
import { SendDTO } from "./dto/send.dto";
import sgMail from "@sendgrid/mail";
import * as marked from "marked";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: MongoRepository<UserEntity>,
        @InjectRepository(MatchEntity)
        private matchRepository: MongoRepository<MatchEntity>,
        private configService: ConfigService,
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

    async getUsersOrUser({
        begin,
        length,
        id,
    }: GetUserDto): Promise<UserEntity[]> {
        if (id) {
            const user = await this.userRepository.findOne({ id });
            if (!user) throw new NotFoundException({ id }, "User Not Found");
            return [user];
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
    async sendAny({ id, message, type }: SendDTO): Promise<Zink.Response> {
        const [user] = await this.getUsersOrUser({ id });
        if (type === "notification") {
            cache.put(`notification.${id}`, message, 24 * 3600 * 1000);
            return {
                message: "Successfully pushed notification",
                data: message,
            };
        }
        if (type === "email") {
            sgMail.send({
                from: this.configService.get<string>("mail"),
                to: user.email,
                html: marked(message),
            });
        }
        throw new BadRequestException("Field of type is invalid");
    }
}
