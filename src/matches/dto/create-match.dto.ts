import { Optional } from "@nestjs/common";
import { Length, IsUUID, IsNotEmpty } from "class-validator";

export abstract class CreateMatchUserDTO {
    @IsUUID(4)
    id: string;
}

export abstract class CreateMatchDTO {
    @Optional()
    @IsUUID(4)
    id?: string;

    @Optional()
    status?: boolean;

    @IsNotEmpty()
    type: Zink.MatchTypes;

    @Length(1, 6)
    users: CreateMatchUserDTO[];
}
