// /backend/api-gateway/src/gateway.controller.ts

import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, Res, UseGuards, Options, Headers } from '@nestjs/common';
import type { Response, Request } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// Hapus RolesGuard dari gateway, biarkan service di belakang yang menanganinya
// import { RolesGuard } from './auth/roles.guard';
// import { Roles } from './auth/roles.decorators';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string; 
  };
}

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Handle OPTIONS requests for CORS preflight
  @Options('*')
  handleOptions(@Res() res: Response) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
  }

  // Health check endpoint
  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'gateway', timestamp: new Date().toISOString() };
  }

  // ===== AUTH ROUTES =====
  @Post('auth/login')
  async login(@Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/login', 'POST', body);
  }

  @Post('auth/register')
  async register(@Body() body: any, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/register', 'POST', body);
  }

  @Get('auth/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Header konsisten untuk SEMUA rute terotentikasi
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/profile', 'GET', null, headers);
  }

  @Post('auth/validate')
  async validateToken(@Req() req: Request, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization
    };
    // PERBAIKAN: Kirim {} (objek kosong) untuk menghindari 'unexpected token n'
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/validate', 'POST', {}, headers);
  }

  // ===== PRODUCT ROUTES =====
  @Get('products')
  async getProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: string,
    @Query('search') search: string,
    @Res() res: Response
  ) {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const queryString = queryParams.toString();
    const path = queryString ? `products?${queryString}` : 'products';
    
    return this.gatewayService.proxyRequest(res, 'product-service', path, 'GET');
  }

  @Get('products/categories')
  async getCategories(@Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', 'products/categories', 'GET');
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'GET');
  }

  // Admin routes - Hapus RolesGuard, biarkan service di belakang
  @Post('products')
  @UseGuards(JwtAuthGuard) 
  async createProduct(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'product-service', 'products', 'POST', body, headers);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'PATCH', body, headers);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'DELETE', null, headers);
  }

  @Patch('products/:id/stock')
  @UseGuards(JwtAuthGuard)
  async updateStock(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}/stock`, 'PATCH', body, headers);
  }

  @Get('products/admin/all')
  @UseGuards(JwtAuthGuard)
  async getAllProductsAdmin(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: string,
    @Query('search') search: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ) {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const queryString = queryParams.toString();
    const path = queryString ? `products/admin/all?${queryString}` : 'products/admin/all';
    
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    
    return this.gatewayService.proxyRequest(res, 'product-service', path, 'GET', null, headers);
  }

  @Get('products/admin/:id')
  @UseGuards(JwtAuthGuard)
  async getProductAdmin(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/admin/${id}`, 'GET', null, headers);
  }

  // ===== ORDER ROUTES =====
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const orderData = {
      ...body,
      userId: req.user.userId 
    };
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', 'orders', 'POST', orderData, headers);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId = req.user.userId;
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/user/${userId}`, 'GET', null, headers);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/${id}`, 'GET', null, headers);
  }

  // ===== CART ROUTES =====

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', 'cart', 'GET', null, headers);
  }

  @Post('cart/items')
  @UseGuards(JwtAuthGuard)
  async addCartItem(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const itemData = {
      ...body,
      userId: req.user.userId 
    };
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', 'cart/items', 'POST', itemData, headers);
  }

  @Patch('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(@Param('itemId') itemId: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', `cart/items/${itemId}`, 'PATCH', body, headers);
  }

  @Delete('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Param('itemId') itemId: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', `cart/items/${itemId}`, 'DELETE', null, headers);
  }

  @Delete('cart')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'order-service', 'cart', 'DELETE', null, headers);
  }
}