import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req, Res, UseGuards, Options, Headers } from '@nestjs/common';
import type { Response, Request } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { RolesGuard } from './auth/roles.guard'; // <-- DIHAPUS
// import { Roles } from './auth/roles.decorators'; // <-- DIHAPUS

// Interface ini masih berguna untuk JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string; // Walaupun mungkin salah dari JWT, kita biarkan di interface
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
    // Kita teruskan token. Service di belakang yang akan memvalidasi.
    const headers = {
      'authorization': req.headers.authorization,
      // Kita juga bisa kirim 'x-user-id' jika service di belakang membutuhkannya
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS karena tidak bisa dipercaya dari JWT
    };
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/profile', 'GET', null, headers);
  }

  @Post('auth/validate')
  async validateToken(@Req() req: Request, @Res() res: Response) {
    // Forward the Authorization header directly to auth-service
    const headers = {
      'authorization': req.headers.authorization
    };
    // PERBAIKAN: Mengirim {} (objek kosong) alih-alih null untuk menghindari 400 Bad Request
    return this.gatewayService.proxyRequest(res, 'auth-service', 'auth/validate', 'POST', {}, headers);
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
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
  async createProduct(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization, // Teruskan token
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'product-service', 'products', 'POST', body, headers);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
  async updateProduct(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'PATCH', body, headers);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
  async deleteProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}`, 'DELETE', null, headers);
  }

  @Patch('products/:id/stock')
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
  async updateStock(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/${id}/stock`, 'PATCH', body, headers);
  }

  // Admin-only product listing (including inactive products)
  @Get('products/admin/all')
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
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
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    
    return this.gatewayService.proxyRequest(res, 'product-service', path, 'GET', null, headers);
  }

  @Get('products/admin/:id')
  @UseGuards(JwtAuthGuard) // <-- RolesGuard DIHAPUS
  // @Roles('admin') // <-- DIHAPUS
  async getProductAdmin(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'product-service', `products/admin/${id}`, 'GET', null, headers);
  }

  // ===== ORDER ROUTES =====
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Rute ini adalah alasan kita tetap memakai JwtAuthGuard, untuk mendapatkan req.user.userId
    const orderData = {
      ...body,
      userId: req.user.userId 
    };
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
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
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    // Perhatikan: path Anda `orders/user/${userId}`
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/user/${userId}`, 'GET', null, headers);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const headers = {
      'authorization': req.headers.authorization,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email
      // 'x-user-role' DIHAPUS
    };
    return this.gatewayService.proxyRequest(res, 'order-service', `orders/${id}`, 'GET', null, headers);
  }
}