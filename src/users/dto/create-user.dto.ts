import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export abstract class CreateUserDto {
    @MaxLength(32)
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(32)
    @MinLength(6)
    password: string;
}
