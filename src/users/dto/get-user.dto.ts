import { IsEmail, IsNotEmpty } from "class-validator";

export abstract class GetUserDto {
  @IsNotEmpty()
  id: number;
  @IsEmail()
  email?: string;
}
