import { IError } from "./Error";

export interface IResponse {
  statusCode?: number;
  err?: IError;
  message?: string;
  [propName: string]: any;
}
