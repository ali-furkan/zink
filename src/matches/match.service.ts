import {
    Injectable,
    HttpException,
    HttpStatus,
    ForbiddenException,
    NotFoundException,
    Inject,
    forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid";
import { MongoRepository } from "typeorm";
import { UsersService } from "../users/user.service";
import { UserEntity } from "../users/user.entity";
import { MatchEntity } from "./match.entity";
import { CreateMatchDTO } from "./dto/create-match.dto";
import { Flag } from "../auth/flag.decorator";

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(MatchEntity)
        private matchRepository: MongoRepository<MatchEntity>,
        @InjectRepository(UserEntity)
        private userRepository: MongoRepository<UserEntity>,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
    ) {}

    async createMatch({
        id,
        type,
        status,
        users,
    }: CreateMatchDTO): Promise<Zink.Response> {
        if (id)
            if ((await this.matchRepository.count({ id })) !== 0)
                throw new HttpException(
                    `${id} Invalid Match ID`,
                    HttpStatus.BAD_REQUEST,
                );
        const uid = id ?? uuidv4();
        const usersData = await users.map(async ({ id }) => {
            const user = await this.userRepository.findOne({ id });
            if (!user)
                throw new HttpException(
                    `${id} not valid User ID`,
                    HttpStatus.BAD_REQUEST,
                );
            else return user;
        });
        const match = await this.matchRepository.create({
            id: uid,
            type,
            status: status || true,
            users,
        });
        await this.matchRepository.save(match);
        return {
            message: "Successfully Created Match",
            status,
            id,
            type,
            users: usersData,
        };
    }

    async deleteMatch(id: string): Promise<Zink.Response> {
        const match = await this.matchRepository.deleteOne({ id });
        if (match.result.ok !== 1) throw new NotFoundException();
        return { message: "Deleted successfully match" };
    }

    async getMatch({
        id,
        user,
    }: {
        id: string;
        user: Zink.RequestUser;
    }): Promise<Zink.Response> {
        const match = await this.matchRepository.findOne({ id });
        const users = await match.users.map(
            async ({ id }) => await this.userRepository.findOne({ id }),
        );
        if (
            !match.users.some(_user => _user.id === user.id) ||
            !this.userService.matchFlags(Flag.CREATE_MATCH, user.flags)
        )
            throw new ForbiddenException();
        return Object.assign({}, match, { users });
    }
}
