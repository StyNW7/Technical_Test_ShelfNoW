import { IsString, IsNumber, IsEnum, IsObject, IsOptional, Min } from 'class-validator';
import { TransactionStatus } from '../interfaces/transaction.interface';

export class CreateTransactionDto {
  @IsString()
  orderId: string;

  @IsString()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsObject()
  @IsOptional()
  paymentDetails?: any;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}