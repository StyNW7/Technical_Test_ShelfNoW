import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// 1. Impor 'Prisma' (untuk tipe TransactionClient)
import { Transaction, TransactionStatus, Prisma } from '@prisma/client'; 

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
    },
    // 2. PERBAIKAN TIPE DI SINI:
    // Gunakan tipe 'Prisma.TransactionClient' yang disediakan oleh Prisma
    // untuk klien transaksi, bukan 'PrismaService'.
    tx?: Prisma.TransactionClient 
  ): Promise<Transaction> {
    
    // 3. 'client' sekarang memiliki tipe yang kompatibel
    const client = tx || this.prisma;

    return client.transaction.create({
      data: {
        orderId: createDto.orderId,
        userId: createDto.userId,
        amount: createDto.amount,
        paymentMethod: createDto.paymentMethod,
        paymentDetails: createDto.paymentDetails || undefined,
        status: TransactionStatus.PENDING, 
      },
    });
  }

  // ... sisa file Anda (findAll, findOne, dll.) tetap sama ...
  
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