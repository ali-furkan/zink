import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class AuthorizeDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(32)
    @MinLength(6)
    password: string;
}
