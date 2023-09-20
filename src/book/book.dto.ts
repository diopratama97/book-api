import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDTO {
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
