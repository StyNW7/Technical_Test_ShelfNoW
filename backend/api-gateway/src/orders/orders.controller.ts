import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { UserRole } from '../auth/interfaces/auth.interface';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
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

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async createOrder(@Body() createOrderDto: any, @Request() req) {
    createOrderDto.userId = req.user.userId;
    return this.orderClient.send('order_create_from_cart', createOrderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllOrders() {
    return this.orderClient.send('order_find_all', {});
  }

  @Get('my-orders')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getMyOrders(@Request() req) {
    return this.orderClient.send('order_find_by_user', req.user.userId);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getOrder(@Param('id') id: string, @Request() req) {
    const order = await this.orderClient.send('order_find_one', id).toPromise();
    
    // Users can only view their own orders unless they're admin
    if (order.data && req.user.role !== UserRole.ADMIN && order.data.userId !== req.user.userId) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    
    return order;
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  async updateOrderStatus(@Param('id') id: string, @Body() updateStatusDto: any) {
    return this.orderClient.send('order_update_status', {
      id,
      updateOrderStatusDto: updateStatusDto,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteOrder(@Param('id') id: string) {
    return this.orderClient.send('order_remove', id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN)
  async getOrderStats() {
    return this.orderClient.send('order_get_stats', {});
  }
}