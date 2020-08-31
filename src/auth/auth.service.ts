import {
    Injectable,
    Inject,
    forwardRef,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";
import * as Jwt from "jsonwebtoken";
import Config from "../config";
import { UsersService } from "../users/user.service";
import { AuthorizeDto } from "./dto/authorize.dto";
import { SignupDto } from "./dto/signup.dto";
import { v4 as uuidv4 } from "uuid";
import * as cache from "memory-cache";
import * as sgMail from "@sendgrid/mail";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        private configService: ConfigService,
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
        const isUnique = await this.userService.isUnique({
            email: userBody.email,
        });
        if (!isUnique)
            throw new ConflictException("This email is already using");
        const code = uuidv4();
        const timeout = 24 * 3600 * 1000;
        cache.put(`email.${code}`, userBody, timeout);
        await sgMail.send({
            from: this.configService.get<string>("mail"),
            to: userBody.email,
            subject: "Verify Your Email Address",
            html: `
                # Thanks for SignUp for Zink
                Hello ${userBody.username},
                We're happy you're here. Let's get your email address verified!
                [Click to Verify Email](http://192.168.1.27:3000/v1/auth/verify?code=${code}&type=email
            `,
        });
        return {
            message: "Check your e-mail",
            timeout,
        };
    }

    async verify(type: string, code: string): Promise<Zink.Response> {
        if (type === "email") {
            const data: SignupDto = cache.get(`${type}.${code}`);
            if (!data) throw new NotFoundException();
            const {
                access_token,
                expires_in,
            } = await this.userService.createUser(data);
            cache.del(`${type}.${code}`);
            return {
                message: "Successfully Verified Account",
                access_token,
                expires_in,
            };
        }
        throw new NotFoundException();
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
