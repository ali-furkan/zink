import { Type } from "src/libs/snowflake";
import { IToken } from "./token";

export type ReqUser = IToken & {
  iat: number;
  exp: number;
} & {
  type: Type;
};
