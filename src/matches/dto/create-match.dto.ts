import { MatchTypes } from "src/@types/Match/type";
import { Length, IsUUID } from "class-validator";

export interface CreateMatchUserDTO {
    id: number;
}

export abstract class CreateMatchDTO {
    @IsUUID(4)
    id?: string;
    status?: boolean;
    type: MatchTypes;
    @Length(1, 6)
    users: CreateMatchUserDTO[];
}
