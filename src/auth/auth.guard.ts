import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Inject,
    forwardRef,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import Config from "../config";
import { UsersService } from "../users/user.service";

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
            async (err, decoded: Zink.IToken) => {
                if (err)
                    return res
                        .status(401)
                        .send({ err: { message: "Invalid Token" } });
                req.user = { ...decoded };
            },
        );
        if (flags) {
            return this.userService.matchFlags(flags, req.user.id);
        }
        return true;
    }
}
