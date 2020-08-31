import {
    Injectable,
    Inject,
    forwardRef,
    HttpException,
    HttpStatus,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import * as argon2 from "argon2";
import { v5 as uuidv5 } from "uuid";
import { AuthService } from "src/auth/auth.service";
import { UserEntity } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { PatchUserDto } from "./dto/patch-user.dto";
import { ConfigService } from "@nestjs/config";

const Flags = {
    PASSIVE_USER: 1 << 0,
    ACTIVE_USER: 1 << 1,
    CREATE_MATCH: 1 << 2,
    CREATE_USER: 1 << 3,
    DEV: 1 << 4,
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: MongoRepository<UserEntity>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    async getUsers(): Promise<UserEntity[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async isCorrectPassword({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<[HttpException | null, UserEntity?]> {
        const user = await this.userRepository.findOne({ email });
        if (!user) return [new NotFoundException()];
        const verify = await argon2.verify(user.password, password);
        if (!verify)
            return [
                new HttpException(
                    "Incorrect Password",
                    HttpStatus.UNAUTHORIZED,
                ),
            ];
        return [null, user];
    }

    async isUnique({ email }: { email: string }): Promise<boolean> {
        const matchUsers = await this.userRepository.count({ email });
        return matchUsers === 0;
    }

    async isExist({
        id,
    }: {
        [propName: string]: any;
    }): Promise<[boolean, UserEntity]> {
        const user = await this.userRepository.findOne({ id });
        return [user instanceof UserEntity, user];
    }

    /**
     *
     * @param param0
     *
     * @deprecated it's not recommended to use
     * @todo add email Validation
     * @todo new email validation
     */
    async editUser({
        user,
        patch,
    }: {
        user: Zink.RequestUser;
        patch: PatchUserDto;
    }): Promise<Zink.Response | { access_token: string; expires_in: number }> {
        const [err, oUser] = await this.isCorrectPassword({
            email: user.email,
            password: patch.password,
        });
        if (err) return err;
        Object.assign(oUser, patch);
        await this.userRepository.update({ id: user.id }, oUser);
        const { access_token, expires_in } = this.authService.generateToken({
            id: oUser.id,
            email: oUser.email,
            flags: oUser.flags,
        });
        return {
            message: "Successfully Patched User",
            access_token,
            expires_in,
        };
    }

    async createUser({
        username,
        email,
        password,
    }: CreateUserDto): Promise<
        Zink.Response & { access_token: string; expires_in: number }
    > {
        const isUnique = await this.isUnique({ email });
        if (!isUnique)
            throw new HttpException(
                "This email is already using",
                HttpStatus.CONFLICT,
            );
        const hash = await argon2.hash(password);
        const id = uuidv5(
            email,
            this.configService.get<string>("UUID_NAMESPACE"),
        );
        const { access_token, expires_in } = this.authService.generateToken({
            flags: Flags.ACTIVE_USER,
            email,
            id,
        });
        const discriminator = await this.genDiscriminator(username);
        const user = this.userRepository.create({
            id,
            username,
            discriminator,
            email,
            password: hash,
        });

        await this.userRepository.save(user);

        return {
            message: "Successfully Signup",
            access_token,
            expires_in,
        };
    }

    async genDiscriminator(username: string): Promise<number> {
        const gen = () => {
            let res = 0;
            for (let i = 0; i < 4; i++) {
                res += Math.floor(Math.random() * 10) * 10 ** i;
            }
            return res;
        };
        const uniqueDiscriminator = async (
            username: string,
        ): Promise<number> => {
            const discriminator = gen();
            const isExist: boolean =
                (await this.userRepository.count({
                    username,
                    discriminator,
                })) !== 0;
            if (isExist) {
                return await uniqueDiscriminator(username);
            } else {
                return discriminator;
            }
        };
        return await uniqueDiscriminator(username);
    }

    async getUserData({
        id,
        email,
    }: GetUserDto): Promise<Zink.Response & UserEntity> {
        const [isExist, user] = await this.isExist({ id });
        if (!isExist)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        if (email && user.email !== email)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        return Object.assign(user, { _id: undefined, password: undefined });
    }

    matchFlags(flag: number, userFlag: number): boolean {
        if (flag == (flag & userFlag)) {
            return true;
        }
        return false;
    }
}
