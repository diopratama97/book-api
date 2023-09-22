import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class RegisterUsersDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

export class UpdateBookDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  year: string;
}

export class QueryBookDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category: string;
}

export class ParamBookDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
