import { 
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDate,
  Min,
  IsISBN,
  IsUrl,
  IsPositive
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsISBN()
  isbn?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pages?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}