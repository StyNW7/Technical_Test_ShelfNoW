import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart_get')
  async getCart(@Payload() userId: string): Promise<any> {
    try {
      const cart = await this.cartService.getOrCreateCart(userId);
      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_add_item')
  async addToCart(@Payload() data: { userId: string; addToCartDto: AddToCartDto }): Promise<any> {
    try {
      const cart = await this.cartService.addToCart(data.userId, data.addToCartDto);
      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_update_item')
  async updateCartItem(@Payload() data: { userId: string; itemId: string; updateCartItemDto: UpdateCartItemDto }): Promise<any> {
    try {
      const cart = await this.cartService.updateCartItem(
        data.userId,
        data.itemId,
        data.updateCartItemDto,
      );
      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_remove_item')
  async removeFromCart(@Payload() data: { userId: string; itemId: string }): Promise<any> {
    try {
      const cart = await this.cartService.removeFromCart(data.userId, data.itemId);
      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_clear')
  async clearCart(@Payload() userId: string): Promise<any> {
    try {
      const cart = await this.cartService.clearCart(userId);
      return {
        success: true,
        data: cart,
        message: 'Cart cleared successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_get_summary')
  async getCartSummary(@Payload() userId: string): Promise<any> {
    try {
      const summary = await this.cartService.getCartSummary(userId);
      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @MessagePattern('cart_get_items')
  async getCartItems(@Payload() userId: string): Promise<any> {
    try {
      const items = await this.cartService.getCartItems(userId);
      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}