import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService so AuthModule can use it
})
export class UsersModule {}