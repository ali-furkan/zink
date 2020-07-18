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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}
  canActivate(ctx: ExecutionContext): any {
    const [req, res] = [
      ctx.switchToHttp().getRequest(),
      ctx.switchToHttp().getResponse()
    ];
    let token: string =
      req.headers["authorization"] || req.headers["x-access-token"];

    if (!token)
      res.status(400).send({ err: { message: "Missing access_token" } });
    token = token.startsWith("Bearer")?token.match(/[^Bearer]\S+/g)[0].trim():token
    jwt.verify(token, Config().secret, async (err, decoded: IToken) => {
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
      req.user = decoded;
    });
    return true
  }
}
