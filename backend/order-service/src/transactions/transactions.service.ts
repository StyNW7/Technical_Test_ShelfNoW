// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// Import from Prisma client directly
import { Transaction, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    createDto: {
      orderId: string;
      userId: string;
      amount: number;
      paymentMethod: string;
      paymentDetails?: any;
    }
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        orderId: createDto.orderId,
        userId: createDto.userId,
        amount: createDto.amount,
        paymentMethod: createDto.paymentMethod,
        paymentDetails: createDto.paymentDetails,
        status: TransactionStatus.PENDING,
      },
      include: {
        order: true,
      },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { orderId },
      include: { order: true },
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
      include: { order: true },
    });
  }
}