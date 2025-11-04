import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { UserRole } from '../auth/interfaces/auth.interface';

@Controller('checkout')
@UseGuards(AuthGuard, RolesGuard)
export class CheckoutController {
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
  async checkout(@Body() checkoutDto: any, @Request() req) {
    const createOrderDto = {
      userId: req.user.userId,
      paymentMethod: checkoutDto.paymentMethod,
      paymentDetails: checkoutDto.paymentDetails,
      shippingAddress: checkoutDto.shippingAddress,
    };

    return this.orderClient.send('order_create_from_cart', createOrderDto);
  }
}