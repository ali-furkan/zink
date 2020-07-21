import { IError } from "./Error";
import { HttpException } from "@nestjs/common";

export interface IResponse {
  statusCode?: number;
  err?: IError;
  message?: string;
  [propName: string]: any;
}

export type TResponse = IResponse|HttpException