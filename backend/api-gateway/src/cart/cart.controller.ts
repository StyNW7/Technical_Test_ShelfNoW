import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { UserRole } from '../auth/interfaces/auth.interface';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
export class CartController {
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
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getCart(@Request() req) {
    return this.orderClient.send('cart_get', req.user.userId);
  }

  @Post('items')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async addToCart(@Body() addToCartDto: any, @Request() req) {
    return this.orderClient.send('cart_add_item', {
      userId: req.user.userId,
      addToCartDto,
    });
  }

  @Put('items/:itemId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: any,
    @Request() req,
  ) {
    return this.orderClient.send('cart_update_item', {
      userId: req.user.userId,
      itemId,
      updateCartItemDto,
    });
  }

  @Delete('items/:itemId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async removeFromCart(@Param('itemId') itemId: string, @Request() req) {
    return this.orderClient.send('cart_remove_item', {
      userId: req.user.userId,
      itemId,
    });
  }

  @Delete()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async clearCart(@Request() req) {
    return this.orderClient.send('cart_clear', req.user.userId);
  }

  @Get('summary')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getCartSummary(@Request() req) {
    return this.orderClient.send('cart_get_summary', req.user.userId);
  }
}