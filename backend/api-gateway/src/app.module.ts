// Lokasi: backend/api-gateway/src/app.module.ts

import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HealthModule } from './health/health.module'; // HealthModule bisa tetap ada

@Module({
  imports: [
    HealthModule, // Modul untuk health check
    PassportModule,
    // Pastikan JWT_SECRET Anda ada di file .env gateway
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    
    // Mendaftarkan semua microservice TCP
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 3001,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'product-service',
          port: 3002,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'order-service',
          port: 3003,
        },
      },
    ]),
  ],
  // HANYA daftarkan GatewayController
  controllers: [GatewayController],
  // Hapus GatewayService, tambahkan provider untuk Auth
  providers: [JwtAuthGuard, JwtStrategy], 
})
export class AppModule {}