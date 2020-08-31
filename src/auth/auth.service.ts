import { Injectable, Inject, forwardRef } from "@nestjs/common";
import * as Jwt from "jsonwebtoken";
import Config from "src/config";
import { UsersService } from "src/users/user.service";
import { AuthorizeDto } from "./dto/authorize.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
    ) {}

    generateToken = (
        payload: Zink.IToken,
    ): { access_token: string; expires_in: number } => ({
        access_token: Jwt.sign(payload, Config().secret, {
            algorithm: "HS512",
            expiresIn: "1y",
        }),
        expires_in: 365 * 24 * 60 * 60 * 1000,
    });

    async signup(userBody: SignupDto): Promise<Zink.Response> {
        return await this.userService.createUser(userBody);
    }

    async authorize({
        email,
        password,
    }: AuthorizeDto): Promise<
        Zink.Response & { access_token: string; expires_in: number }
    > {
        const [err, user] = await this.userService.isCorrectPassword({
            email,
            password,
        });
        if (err) throw err;
        const payload = {
            id: user.id,
            flags: user.flags,
            email: user.email,
        };
        const { access_token, expires_in } = this.generateToken(payload);
        return {
            message: "Successfully Authorize",
            access_token,
            expires_in,
        };
    }
}
