import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorators';

// Interface for authenticated requests
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
    // Forward the request with user info from JWT
    const headers = {
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/profile', 'GET', null, headers);
  }

  @Post('auth/validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-role': req.user.role
    };
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/validate', 'POST', null, headers);
  }

  // ===== PRODUCT ROUTES =====
  // Public routes - no auth required
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

  // Admin only routes
  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createProduct(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', 'products', 'POST', body);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'PATCH', body);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'DELETE');
  }

  @Patch('products/:id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStock(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}/stock`, 'PATCH', body);
  }

  @Delete('products/:id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async permanentDelete(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}/permanent`, 'DELETE');
  }

  @Patch('products/:id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async restoreProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}/restore`, 'PATCH');
  }

  @Get('products/admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
    
    return this.gatewayService.proxyRequest(res, 'product-service', path, 'GET');
  }

  @Get('products/admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getProductAdmin(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'product-service', `products/admin/${id}`, 'GET');
  }

  // ===== ORDER ROUTES =====
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Add user ID from JWT to order data
    const orderData = {
      ...body,
      userId: req.user.userId
    };
    return this.gatewayService.proxyRequest(res, 'order-service', 'orders', 'POST', orderData);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const userId = req.user.userId;
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/user/${userId}`, 'GET');
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/${id}`, 'GET');
  }
}