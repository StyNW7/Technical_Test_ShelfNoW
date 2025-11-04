import { 
  Controller, Get, Post, Patch, Delete, Body, 
  Param, Query, Req, Res, UseGuards, Options, Inject,
  HttpException, HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

// DTO Stub (untuk type-safety, bisa Anda pindahkan ke file sendiri)
class AddToCartDto {
  productId: string;
  quantity: number;
  price: number;
}
class UpdateCartItemDto {
  quantity: number;
}

// Interface untuk request yang sudah terotentikasi
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string; 
  };
}

@Controller()
export class GatewayController {
  
  // 1. INJECT SEMUA KLIEN MICROSERVICE (BUKAN GatewayService)
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productServiceClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
  ) {}

  /**
   * 2. FUNGSI HELPER UNTUK MENGIRIM PESAN TCP
   * Menerima permintaan HTTP (via res) dan mengirim pesan TCP (via client)
   */
  private async sendMicroserviceRequest(
    res: Response,
    client: ClientProxy, 
    pattern: string, 
    data: any, 
  ) {
    try {
      // Mengirim pesan dan menunggu respons dengan timeout 5 detik
      const result = await firstValueFrom(
        client.send(pattern, data).pipe(timeout(5000)) 
      );

      // Microservice (seperti cart.controller) akan mengembalikan { success: boolean, ... }
      if (result.success === false) {
        // Jika service mengembalikan error yang terkendali (misal: "Stok habis")
        throw new HttpException(
          result.message || 'Error from microservice', 
          result.statusCode || HttpStatus.BAD_REQUEST
        );
      }
      
      // Kirim data yang berhasil kembali ke frontend
      return res.status(HttpStatus.OK).json(result.data || result);

    } catch (error) {
      // Tangani error (misal: timeout, service down, atau error yang dilempar)
      console.error(`[Gateway] Microservice error for pattern '${pattern}':`, error);
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json(error.getResponse());
      }
      // Error jika service tidak terjangkau
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: `Service '${pattern.split('_')[0]}' is unavailable or timed out.`,
      });
    }
  }

  // Handle OPTIONS requests for CORS preflight
  @Options('*')
  handleOptions(@Res() res: Response) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
  }

  // ===== AUTH ROUTES =====
  // CATATAN: 'auth_login' adalah tebakan. Sesuaikan dengan @MessagePattern di auth-service Anda
  @Post('auth/login')
  async login(@Body() body: any, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'auth_login', body);
  }

  @Post('auth/register')
  async register(@Body() body: any, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'auth_register', body);
  }

  @Get('auth/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'auth_get_profile', req.user);
  }

  @Post('auth/validate')
  async validateToken(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'auth_validate_token', { token });
  }

  // ===== ADMIN USER MANAGEMENT ROUTES =====

  @Get('users')
  @UseGuards(JwtAuthGuard) // Menggunakan Guard dari Gateway
  async adminGetAllUsers(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Kita juga bisa menambahkan pengecekan role di sini jika perlu
    // if (req.user.role.toLowerCase() !== 'admin') {
    //   return res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden' });
    // }
    
    // Payload hanya berisi data user yang terotentikasi
    const payload = { user: req.user };
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'admin_get_all_users', payload);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async adminGetUserById(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { 
      user: req.user,
      id: id // Mengirim ID dari parameter
    };
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'admin_get_user_by_id', payload);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async adminDeleteUser(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { 
      user: req.user,
      id: id // Mengirim ID dari parameter
    };
    return this.sendMicroserviceRequest(res, this.authServiceClient, 'admin_delete_user', payload);
  }

  // ===== PRODUCT ROUTES =====
  // CATATAN: 'products_get_all' adalah tebakan. Sesuaikan dengan @MessagePattern di product-service Anda
  @Get('products')
  async getProducts(@Query() query: any, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_get_all', query);
  }

  @Get('products/categories')
  async getCategories(@Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_get_categories', {});
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_get_one', { id });
  }

  @Post('products')
  @UseGuards(JwtAuthGuard) 
  async createProduct(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { ...body, user: req.user };
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_create', payload);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { id, updateDto: body, user: req.user };
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_update', payload);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { id, user: req.user };
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_delete', payload);
  }

  @Get('products/admin/all') // Rute HTTP
  @UseGuards(JwtAuthGuard)
  async getAllProductsAdmin(
    @Query() query: any, 
    @Req() req: AuthenticatedRequest, 
    @Res() res: Response
  ) {
    const payload = { query, user: req.user };
    // PERBAIKI INI: Panggil 'products_get_admin_all', bukan 'products_get_all'
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_get_admin_all', payload);
  }

  @Get('products/admin/:id') // Rute HTTP
  @UseGuards(JwtAuthGuard)
  async getProductAdmin(
    @Param('id') id: string, 
    @Req() req: AuthenticatedRequest, 
    @Res() res: Response
  ) {
    const payload = { id, user: req.user };
    // PERBAIKI INI: Panggil 'products_get_admin_one', bukan 'products_get_one'
    return this.sendMicroserviceRequest(res, this.productServiceClient, 'products_get_admin_one', payload);
  }

  // ===== ORDER ROUTES (Selain Cart) =====
  // CATATAN: 'order_create' adalah tebakan.
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: any, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { createOrderDto: body, userId: req.user.userId };
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'order_create', payload);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'order_get_by_user', req.user.userId);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = { orderId: id, userId: req.user.userId };
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'order_get_one', payload);
  }

  // ===== CART ROUTES (INI YANG SUDAH PASTI BENAR) =====

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Pola 'cart_get' sudah cocok dengan cart.controller.ts Anda
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'cart_get', req.user.userId);
  }

  @Post('cart/items')
  @UseGuards(JwtAuthGuard)
  async addCartItem(@Body() body: AddToCartDto, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = {
      userId: req.user.userId,
      addToCartDto: body
    };
    // Pola 'cart_add_item' sudah cocok dengan cart.controller.ts Anda
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'cart_add_item', payload);
  }

  @Patch('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(@Param('itemId') itemId: string, @Body() body: UpdateCartItemDto, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = {
      userId: req.user.userId,
      itemId: itemId,
      updateCartItemDto: body
    };
    // Pola 'cart_update_item' sudah cocok dengan cart.controller.ts Anda
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'cart_update_item', payload);
  }

  @Delete('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Param('itemId') itemId: string, @Req() req: AuthenticatedRequest, @Res() res: Response) {
    const payload = {
      userId: req.user.userId,
      itemId: itemId
    };
    // Pola 'cart_remove_item' sudah cocok dengan cart.controller.ts Anda
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'cart_remove_item', payload);
  }

  @Delete('cart')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    // Pola 'cart_clear' sudah cocok dengan cart.controller.ts Anda
    return this.sendMicroserviceRequest(res, this.orderServiceClient, 'cart_clear', req.user.userId);
  }
}