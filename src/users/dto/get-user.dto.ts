import { IsEmail, IsNotEmpty } from "class-validator";

export abstract class GetUserDto {
    @IsNotEmpty()
    id: string;

    @IsEmail()
    email?: string;
}
