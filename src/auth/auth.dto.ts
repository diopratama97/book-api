import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class loginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

export class refreshAccessTokenDTO {
  refresh_token: string;
}
