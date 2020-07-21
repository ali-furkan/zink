import { IsEmail, IsNotEmpty } from "class-validator";

export class GetUserDto {
  @IsNotEmpty()
  id: number;
  @IsEmail()
  email?: string;
}
