// cart-http.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartHttpController {
  constructor(private readonly cartService: CartService) {}

  @Get('cart')
  async getCart(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const cart = await this.cartService.getOrCreateCart(userId);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('cart/items')
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const cart = await this.cartService.addToCart(userId, addToCartDto);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Patch('cart/items/:itemId')
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const cart = await this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Delete('cart/items/:itemId')
  async removeFromCart(@Param('itemId') itemId: string, @Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const cart = await this.cartService.removeFromCart(userId, itemId);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Delete('cart')
  async clearCart(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const cart = await this.cartService.clearCart(userId);
      return res.status(200).json({
        success: true,
        data: cart,
        message: 'Cart cleared successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('cart/summary')
  async getCartSummary(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in request',
        });
      }

      const summary = await this.cartService.getCartSummary(userId);
      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}