import { IsUUID } from "class-validator";

export abstract class GetMatchDto {
    @IsUUID()
    id?: string;
    begin: number;
    length: number;
    status: boolean;
}
