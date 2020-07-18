import * as express from "express";
import { IToken } from "./User/token";

declare module "express" {
  export interface Request extends express.Request {
    user: IToken;
  }
}
