import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// Definisikan tipe data Product (salin dari frontend api.ts)
interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

// ===== PERBAIKAN DI SINI (1) =====
// Izinkan 'product' menjadi 'null'
interface EnrichedCartItem extends CartItem {
  product: Product | null; 
}
// ==================================

interface FullCart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: EnrichedCartItem[]; // Ganti nama 'cartItems' menjadi 'items'
  totalItems: number;
  totalPrice: number;
}


@Injectable()
export class CartService {
  getCartSummary(userId: string) {
    throw new Error('Method not implemented.');
  }
  getCartItems(userId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    @Inject('PRODUCT_SERVICE') private readonly productServiceClient: ClientProxy,
  ) {}

  async getOrCreateCart(userId: string): Promise<FullCart> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true }, 
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { cartItems: true },
      });
    }

    let enrichedItems: EnrichedCartItem[] = [];
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.cartItems && cart.cartItems.length > 0) {
      const productIds = cart.cartItems.map((item) => item.productId);

      const products: Product[] = await firstValueFrom(
        this.productServiceClient.send('products_get_by_ids', productIds),
      );

      const productMap = new Map(products.map((p) => [p.id, p]));

      enrichedItems = cart.cartItems.map((item) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        return {
          ...item,
          // Kode ini sekarang valid karena 'EnrichedCartItem' mengizinkan null
          product: productMap.get(item.productId) || null, 
        };
      });
    }

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: enrichedItems, 
      totalItems: totalItems, 
      totalPrice: totalPrice, 
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<FullCart> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    const cartId = cart ? cart.id : (await this.getOrCreateCart(userId)).id;

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: addToCartDto.productId,
      },
    });

    if (existingCartItem) {
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + addToCartDto.quantity,
          price: addToCartDto.price,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cartId,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
          price: addToCartDto.price,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<FullCart> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartItemDto.quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: updateCartItemDto.quantity },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<FullCart> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<FullCart> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(userId);
  }
}