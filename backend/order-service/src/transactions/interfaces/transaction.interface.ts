export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  paymentDetails?: any;
  createdAt: Date;
  updatedAt: Date;
  order?: any;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export interface CreateTransactionDto {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails?: any;
}

export interface UpdateTransactionStatusDto {
  status: TransactionStatus;
}