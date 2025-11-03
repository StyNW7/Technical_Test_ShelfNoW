import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: '1h' },
    }),
    ProductsModule,
  ],
})
export class AppModule {}