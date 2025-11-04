import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart, CartItem, CartSummary } from './interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  // Ganti @Inject('PRISMA_CLIENT') dengan injeksi PrismaService standar
  constructor(private prisma: PrismaService) {}

  // ... (SEMUA KODE LAINNYA DI FILE INI SAMA PERSIS) ...
  // ... (getOrCreateCart, addToCart, updateCartItem, dll. sudah benar) ...
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: [],
          },
        },
        include: {
          cartItems: true,
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
      },
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + addToCartDto.quantity,
          price: addToCartDto.price,
        },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
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
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartItemDto.quantity === 0) {
      // Remove item if quantity is 0
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: updateCartItemDto.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(userId);
  }

  async getCartSummary(userId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);

    const totalItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      totalItems,
      totalAmount,
      items: cart.cartItems,
    };
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.getOrCreateCart(userId);
    return cart.cartItems;
  }
}