import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Order, OrderStatus, Prisma, TransactionStatus } from '@prisma/client'; 
import { CartService } from '../cart/cart.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createOrderFromCart(createOrderDto: CreateOrderFromCartDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      
      const fullCart = await this.cartService.getOrCreateCart(createOrderDto.userId);
      const cartItems = fullCart.items;

      if (!cartItems || cartItems.length === 0) { 
        throw new Error('Cart is empty');
      }

      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Buat pesanan
      const order = await tx.order.create({
        data: {
          userId: createOrderDto.userId,
          totalAmount,
          status: OrderStatus.PENDING,
          
          // PERBAIKAN #1: Hapus 'shippingAddress' karena tidak ada di schema.prisma Anda
          // shippingAddress: createOrderDto.shippingAddress as Prisma.InputJsonValue, 
          
          orderItems: {
            create: cartItems.map(item => {
              
              // PERBAIKAN #2: Periksa apakah produk ada sebelum menambahkannya
              if (!item.product) {
                throw new Error(`Product data missing for item ${item.productId}. Cannot create order.`);
              }

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                // Hapus 'title' dan 'imageUrl' karena tidak ada di schema.prisma Anda
                // title: item.product.title, 
                // imageUrl: item.product.imageUrl || null
              };
            }),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // PERBAIKAN #3: Teruskan 'userId' dan 'totalAmount' ke transactionsService
      await this.transactionsService.createTransaction({
        orderId: order.id,
        userId: createOrderDto.userId, // <-- WAJIB
        amount: totalAmount,           // <-- WAJIB
        paymentMethod: createOrderDto.paymentMethod,
        paymentDetails: createOrderDto.paymentDetails as Prisma.InputJsonValue,
      }, tx);

      // Hapus keranjang
      await this.cartService.clearCart(createOrderDto.userId);

      return order as Order;
    });
  }
  
  // Fungsi lain di bawah ini sudah benar

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