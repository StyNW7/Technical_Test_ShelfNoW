import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller()
export class OrdersController {
  constructor(
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  @MessagePattern('order_create_from_cart')
  async createFromCart(@Payload() createOrderDto: CreateOrderFromCartDto) {
    try {
      const order = await this.ordersService.createOrderFromCart(createOrderDto);
      return {
        success: true,
        data: order,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('order_find_all')
  async findAll() {
    const orders = await this.ordersService.findAll();
    return {
      success: true,
      data: orders,
    };
  }

  @MessagePattern('order_find_one')
  async findOne(@Payload() id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }
    return {
      success: true,
      data: order,
    };
  }

  @MessagePattern('order_find_by_user')
  async findByUserId(@Payload() userId: string) {
    const orders = await this.ordersService.findByUserId(userId);
    return {
      success: true,
      data: orders,
    };
  }

  @MessagePattern('order_update_status')
  async updateStatus(@Payload() data: { id: string; updateOrderStatusDto: UpdateOrderStatusDto }) {
    try {
      const order = await this.ordersService.updateStatus(data.id, data.updateOrderStatusDto);
      return {
        success: true,
        data: order,
        message: 'Order status updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('order_remove')
  async remove(@Payload() id: string) {
    try {
      await this.ordersService.remove(id);
      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('order_get_stats')
  async getStats() {
    const stats = await this.ordersService.getOrderStats();
    return {
      success: true,
      data: stats,
    };
  }
}