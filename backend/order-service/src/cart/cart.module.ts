// Lokasi: order-service/src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
// import { CartHttpController } from './cart-http.controller'; // <-- Hapus ini
import { ClientsModule, Transport } from '@nestjs/microservices'; // <-- Impor

@Module({
  imports: [
    // Daftarkan product-service agar bisa di-inject
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'product-service',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [CartController], // <-- Pastikan CartHttpController sudah dihapus
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}