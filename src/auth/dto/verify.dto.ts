import { IsNotEmpty, IsUUID } from "class-validator";

export abstract class VerifyDTO {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsUUID(4)
    code: string;
}
