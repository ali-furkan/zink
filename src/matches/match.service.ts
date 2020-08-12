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

    async getMatch({
        id,
        user,
    }: {
        id: string;
        user: ReqUser;
    }): Promise<TResponse> {
        const match = await this.matchRepository.findOne({ id });
        const users = await match.users.map(async ({id})=>await this.userRepository.findOne({id}))
        const SID = this.snowflake.serialization(user.id);
        if (
            !match.users.some(_user => _user.id === user.id) ||
            SID.flags.includes("CREATE_MATCH")
        )
            throw new ForbiddenException();
        return Object.assign({},match,{users});
    }
}
