import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Auth routes - public
  @Post('auth/login')
  async login(@Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/login', 'POST', body);
  }

  @Post('auth/register')
  async register(@Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/register', 'POST', body);
  }

  // Product routes - public read, admin write
  @Get('products')
  async getProducts(@Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', 'products', 'GET');
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'GET');
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createProduct(@Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', 'products', 'POST', body);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'PUT', body);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'DELETE');
  }

  // Checkout routes - authenticated users only
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    // Add user ID from JWT to checkout data
    const checkoutData = {
      ...body,
      userId: req.user['userId']
    };
    return this.gatewayService.proxyRequest(res, 'checkout-service', 'checkout', 'POST', checkoutData);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['userId'];
    return this.gatewayService.proxyRequest(res, 'checkout-service', `orders/user/${userId}`, 'GET');
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'checkout-service', `orders/${id}`, 'GET');
  }
}