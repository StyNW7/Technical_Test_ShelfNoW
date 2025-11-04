import { TransactionStatus } from '@prisma/client';

export class CreateTransactionDto {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails?: any;
  status?: TransactionStatus;
}