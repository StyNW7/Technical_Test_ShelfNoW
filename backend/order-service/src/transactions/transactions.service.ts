import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Transaction, TransactionStatus } from './interfaces/transaction.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(@Inject('PRISMA_CLIENT') private prisma: PrismaClient) {}

  async createTransaction(createTransactionDto: CreateTransactionDto, tx?: any): Promise<Transaction> {
    const prisma = tx || this.prisma;

    return prisma.transaction.create({
      data: {
        orderId: createTransactionDto.orderId,
        userId: createTransactionDto.userId,
        amount: createTransactionDto.amount,
        paymentMethod: createTransactionDto.paymentMethod,
        paymentDetails: createTransactionDto.paymentDetails,
        status: createTransactionDto.status || TransactionStatus.PENDING,
      },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    });
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
      include: {
        order: true,
      },
    });
  }

  async getTransactionStats(): Promise<{
    totalTransactions: number;
    totalRevenue: number;
    pendingTransactions: number;
  }> {
    const transactions = await this.prisma.transaction.findMany();

    const totalTransactions = transactions.length;
    const totalRevenue = transactions
      .filter(t => t.status === TransactionStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingTransactions = transactions.filter(
      t => t.status === TransactionStatus.PENDING,
    ).length;

    return { totalTransactions, totalRevenue, pendingTransactions };
  }
}