import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartHttpController } from './cart-http.controller';

@Module({
  controllers: [CartController, CartHttpController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}