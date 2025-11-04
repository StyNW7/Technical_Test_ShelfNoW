import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
// PERBAIKAN: Impor TransactionStatus dari @prisma/client, BUKAN interface lokal
import { TransactionStatus } from '@prisma/client'; 

@Controller()
export class TransactionsController {
  constructor(
    @Inject(TransactionsService) private readonly transactionsService: TransactionsService,
  ) {}

  @MessagePattern('transaction_find_all')
  async findAll() {
    const transactions = await this.transactionsService.findAll();
    return {
      success: true,
      data: transactions,
    };
  }

  @MessagePattern('transaction_find_one')
  async findOne(@Payload() id: string) {
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) {
      return {
        success: false,
        message: 'Transaction not found',
      };
    }
    return {
      success: true,
      data: transaction,
    };
  }

  @MessagePattern('transaction_find_by_user')
  async findByUserId(@Payload() userId: string) {
    const transactions = await this.transactionsService.findByUserId(userId);
    return {
      success: true,
      data: transactions,
    };
  }

  @MessagePattern('transaction_find_by_order')
  async findByOrderId(@Payload() orderId: string) {
    const transaction = await this.transactionsService.findByOrderId(orderId);
    if (!transaction) {
      return {
        success: false,
        message: 'Transaction not found for this order',
      };
    }
    return {
      success: true,
      data: transaction,
    };
  }

  @MessagePattern('transaction_update_status')
  async updateStatus(@Payload() data: { id: string; status: TransactionStatus }) { // Tipe ini sekarang benar
    try {
      const transaction = await this.transactionsService.updateTransactionStatus(
        data.id,
        data.status,
      );
      return {
        success: true,
        data: transaction,
        message: 'Transaction status updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Hapus 'transaction_get_stats' karena service-nya tidak memiliki fungsi itu
  // @MessagePattern('transaction_get_stats')
  // async getStats() { ... }
}