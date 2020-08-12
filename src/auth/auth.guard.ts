import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Inject,
    forwardRef,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import Config from "src/config";
import { UsersService } from "src/users/user.service";
import { IToken } from "src/@types/User/token";
import { matchFlags } from "../libs/snowflake";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        private reflector: Reflector,
    ) {}
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const flags = this.reflector.get<number>("flags", ctx.getHandler());
        const [req, res] = [
            ctx.switchToHttp().getRequest(),
            ctx.switchToHttp().getResponse(),
        ];
        let token: string =
            req.query["access_token"] ||
            req.headers["authorization"] ||
            req.headers["x-access-token"];

        if (!token)
            return res
                .status(401)
                .send({ err: { message: "Unauthorized Request" } });
        token = token.startsWith("Bearer")
            ? token.match(/[^Bearer]\S+/g)[0].trim()
            : token;
        await jwt.verify(
            token,
            Config().secret,
            async (err, decoded: IToken) => {
                if (err)
                    return res
                        .status(401)
                        .send({ err: { message: "Invalid Token" } });
                const isExist = !(await this.userService.isUnique({
                    email: decoded.email,
                }));
                if (!isExist)
                    return res
                        .status(401)
                        .send({ err: { message: "User Not Found" } });
                req.user = { ...decoded };
            },
        );
        if (flags) {
            return matchFlags(flags, req.user.id);
        }
        return true;
    }
}
