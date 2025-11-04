// src/transactions/transactions.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
// Import from Prisma client
import { TransactionStatus } from '@prisma/client';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('transaction_create')
  async create(@Payload() createDto: {
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    paymentDetails?: any;
  }) {
    try {
      const transaction = await this.transactionsService.createTransaction(createDto);
      return {
        success: true,
        data: transaction,
        message: 'Transaction created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('transaction_find_all')
  async findAll() {
    try {
      const transactions = await this.transactionsService.findAll();
      return {
        success: true,
        data: transactions,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('transaction_find_one')
  async findOne(@Payload() id: string) {
    try {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('transaction_find_by_user')
  async findByUserId(@Payload() userId: string) {
    try {
      const transactions = await this.transactionsService.findByUserId(userId);
      return {
        success: true,
        data: transactions,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('transaction_find_by_order')
  async findByOrderId(@Payload() orderId: string) {
    try {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('transaction_update_status')
  async updateStatus(@Payload() data: { id: string; status: TransactionStatus }) {
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
}