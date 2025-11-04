import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CartService } from '../cart/cart.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './interfaces/order.interface';
import { TransactionStatus } from 'src/transactions/interfaces/transaction.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('PRISMA_CLIENT') private prisma: PrismaClient,
    private readonly cartService: CartService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createOrderFromCart(createOrderDto: CreateOrderFromCartDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // Get cart items
      const cartItems = await this.cartService.getCartItems(createOrderDto.userId);
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Create order
      const order = await tx.order.create({
        data: {
          userId: createOrderDto.userId,
          totalAmount,
          status: OrderStatus.PENDING,
          orderItems: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Create transaction
      await this.transactionsService.createTransaction({
        orderId: order.id,
        userId: createOrderDto.userId,
        amount: totalAmount,
        paymentMethod: createOrderDto.paymentMethod,
        paymentDetails: createOrderDto.paymentDetails,
      }, tx);

      // Clear cart after successful order
      await this.cartService.clearCart(createOrderDto.userId);

      return order;
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        orderItems: true,
        transaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        transaction: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        transaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        orderItems: true,
        transaction: true,
      },
    });

    // If order is delivered, mark transaction as completed
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED && order.transaction) {
      await this.transactionsService.updateTransactionStatus(
        order.transaction.id,
        TransactionStatus.COMPLETED,
      );
    }

    return order;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  async getOrderStats(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number }> {
    const orders = await this.prisma.order.findMany({
      include: {
        transaction: true,
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => order.transaction?.status === 'COMPLETED')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING).length;

    return { totalOrders, totalRevenue, pendingOrders };
  }
}