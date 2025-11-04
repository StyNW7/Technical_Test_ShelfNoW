import { Controller, ForbiddenException, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Interface untuk payload yang dikirim dari gateway
interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Helper untuk memeriksa role dari payload
  private checkAdminRole(user: AuthenticatedUser): void {
    if (!user || !user.role) {
      throw new ForbiddenException('No user role provided in payload');
    }
    if (user.role.toLowerCase() !== 'admin') {
      throw new ForbiddenException(`Insufficient permissions. Required: admin, Got: ${user.role}`);
    }
  }

  // CREATE - Admin
  @MessagePattern('products_create')
  async create(@Payload() payload: { createDto: CreateProductDto; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    // Kita gunakan new ValidationPipe() di sini untuk memvalidasi DTO
    const createProductDto = new CreateProductDto();
    Object.assign(createProductDto, payload.createDto);
    return this.productsService.create(createProductDto);
  }

  // READ - Public
  @MessagePattern('products_get_all')
  async findAll(@Payload() query: { page?: number; limit?: number; category?: string; search?: string }) {
    return this.productsService.findAll(query.page, query.limit, query.category, query.search);
  }

  // READ - Public
  @MessagePattern('products_get_categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  // READ - Public
  @MessagePattern('products_get_one')
  async findOne(@Payload() payload: { id: string }) {
    return this.productsService.findOne(payload.id);
  }

  // UPDATE - Admin
  @MessagePattern('products_update')
  async update(@Payload() payload: { id: string; updateDto: UpdateProductDto; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    const updateProductDto = new UpdateProductDto();
    Object.assign(updateProductDto, payload.updateDto);
    return this.productsService.update(payload.id, updateProductDto);
  }

  // DELETE (Soft Delete) - Admin
  @MessagePattern('products_delete')
  async remove(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    return this.productsService.remove(payload.id);
  }

  // UPDATE STOCK - Admin
  @MessagePattern('products_update_stock')
  async updateStock(@Payload() payload: { id: string; quantity: number; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    return this.productsService.updateStock(payload.id, payload.quantity);
  }

  // HARD DELETE - Admin
  @MessagePattern('products_permanent_delete')
  async permanentRemove(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    return this.productsService.permanentRemove(payload.id);
  }

  // RESTORE - Admin
  @MessagePattern('products_restore')
  async restore(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    return this.productsService.restore(payload.id);
  }

  // GET ALL (Admin) - Admin
  @MessagePattern('products_get_admin_all')
  async findAllAdmin(@Payload() payload: { query: { page?: number; limit?: number; category?: string; search?: string }; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    const { query } = payload;
    return this.productsService.findAllAdmin(query.page, query.limit, query.category, query.search);
  }

  // GET ONE (Admin) - Admin
  @MessagePattern('products_get_admin_one')
  async findOneAdmin(@Payload() payload: { id: string; user: AuthenticatedUser }) {
    this.checkAdminRole(payload.user);
    // Menggunakan findOne yang sudah ada karena service-nya sama
    return this.productsService.findOne(payload.id);
  }

  @MessagePattern('products_get_by_ids')
  async findByIds(@Payload() ids: string[]) {
    return this.productsService.findByIds(ids);
  }

}