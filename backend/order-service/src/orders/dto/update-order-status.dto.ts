// src/orders/dto/update-order-status.dto.ts
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  status: OrderStatus;
}