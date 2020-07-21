import * as express from "express";
import { IToken } from "./User/token";

declare namespace Nest {
  export interface Request extends express.Request {
    user: IToken;
  }

  export type Response = express.Response;
}
