import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OrdersController } from './orders/orders.controller';
import { CartController } from './cart/cart.controller';
import { CheckoutController } from './checkout/checkout.controller';
import { TransactionsController } from './transactions/transactions.controller';

@Module({
  imports: [AuthModule, HealthModule],
  controllers: [
    GatewayController,
    OrdersController,
    CartController,
    CheckoutController,
    TransactionsController
  ],
  providers: [GatewayService, Reflector],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}