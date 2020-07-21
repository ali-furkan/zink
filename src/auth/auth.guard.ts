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
import { SnowflakeFactory, Flag, Type } from "../libs/snowflake";

@Injectable()
export class AuthGuard implements CanActivate {
  private snowflake = new SnowflakeFactory([Flag.ACTIVE_USER], Type.USER);
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const [req, res] = [
      ctx.switchToHttp().getRequest(),
      ctx.switchToHttp().getResponse(),
    ];
    let token: string =
      req.query["access_token"] ||
      req.headers["authorization"] ||
      req.headers["x-access-token"];

    if (!token)
      return res.status(401).send({ err: { message: "Unauthorized Request" } });
    token = token.startsWith("Bearer")
      ? token.match(/[^Bearer]\S+/g)[0].trim()
      : token;
    await jwt.verify(token, Config().secret, async (err, decoded: IToken) => {
      if (err)
        return res.status(401).send({ err: { message: "Invalid Token" } });
      const isExist = !(await this.userService.isUnique({
        email: decoded.email,
      }));
      if (!isExist)
        return res.status(401).send({ err: { message: "User Not Found" } });
      const data = this.snowflake.serialization(decoded.id);
      req.user = { ...decoded, type: data.type };
    });
    return true;
  }
}
