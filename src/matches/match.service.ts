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
import { MatchEntity } from "./match.entity";
import { UserEntity } from "../users/user.entity";
import { TResponse } from "src/@types/Response/Response";
import { CreateMatchDTO } from "./dto/create-match.dto";
import { MongoRepository } from "typeorm";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { ReqUser } from "src/@types/User/ReqUser";
import { SnowflakeFactory, Type, Flag } from "src/libs/snowflake";
import { UsersService } from "src/users/user.service";

@Injectable()
export class MatchService {
    private snowflake = new SnowflakeFactory([Flag.ACTIVE_USER], Type.USER);
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
    }: CreateMatchDTO): Promise<TResponse> {
        if (id) {
            if ((await this.matchRepository.count({ id })) !== 0)
                throw new HttpException(
                    `${id} Invalid Match ID`,
                    HttpStatus.BAD_REQUEST,
                );
            if (!uuidValidate(id))
                throw new HttpException(
                    `${id} Invalid Match ID`,
                    HttpStatus.BAD_REQUEST,
                );
        }
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
        await this.matchRepository.create({
            id: uid,
            type,
            status: status ?? true,
            users,
        });
        return {
            message: "Successfully Created Match",
            status,
            id,
            type,
            users: usersData,
        };
    }

    async deleteMatch(id: string): Promise<TResponse> {
        const match = await this.matchRepository.deleteOne({ id });
        if (match.result.ok !== 1) throw new NotFoundException();
        return { message: "Deleted successfully match" };
    }

    async getMatch({
        id,
        user,
    }: {
        id: string;
        user: ReqUser;
    }): Promise<TResponse> {
        const match = await this.matchRepository.findOne({ id });
        const users = await match.users.map(
            async ({ id }) => await this.userRepository.findOne({ id }),
        );
        const SID = this.snowflake.serialization(user.id);
        if (
            !match.users.some(_user => _user.id === user.id) ||
            SID.flags.includes("CREATE_MATCH")
        )
            throw new ForbiddenException();
        return Object.assign({}, match, { users });
    }
}
