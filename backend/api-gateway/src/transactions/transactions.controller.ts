import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { UserRole } from '../auth/interfaces/auth.interface';

@Controller('transactions')
@UseGuards(AuthGuard, RolesGuard)
export class TransactionsController {
  private orderClient: ClientProxy;

  constructor() {
    this.orderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'order-service',
        port: 3003,
      },
    });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllTransactions() {
    return this.orderClient.send('transaction_find_all', {});
  }

  @Get('my-transactions')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getMyTransactions(@Request() req) {
    return this.orderClient.send('transaction_find_by_user', req.user.userId);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getTransaction(@Param('id') id: string, @Request() req) {
    const transaction = await this.orderClient.send('transaction_find_one', id).toPromise();
    
    // Users can only view their own transactions unless they're admin
    if (transaction.data && req.user.role !== UserRole.ADMIN && transaction.data.userId !== req.user.userId) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    
    return transaction;
  }

  @Get('order/:orderId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getTransactionByOrder(@Param('orderId') orderId: string, @Request() req) {
    const transaction = await this.orderClient.send('transaction_find_by_order', orderId).toPromise();
    
    if (transaction.data && req.user.role !== UserRole.ADMIN && transaction.data.userId !== req.user.userId) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    
    return transaction;
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN)
  async getTransactionStats() {
    return this.orderClient.send('transaction_get_stats', {});
  }
}