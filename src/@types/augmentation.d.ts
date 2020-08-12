import * as express from "express";
import { IToken } from "./User/token";
import { Type, ISnowflake } from "src/libs/snowflake";

declare namespace Nest {
    export interface Request extends express.Request {
        user: IToken & { type: Type } & { SID: ISnowflake };
    }
    export type Response = express.Response;
}
