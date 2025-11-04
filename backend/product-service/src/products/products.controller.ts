import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  ParseIntPipe,
  DefaultValuePipe,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Helper method to check admin role from headers - FIXED: Case insensitive
  private checkAdminRole(headers: any): void {
    const userRole = headers['x-user-role'];
    console.log('Checking admin role:', { userRole, headers: headers['x-user-role'] });
    
    if (!userRole) {
      throw new ForbiddenException('No role provided in headers');
    }
    
    // Case insensitive check
    if (userRole.toLowerCase() !== 'admin') {
      throw new ForbiddenException(`Insufficient permissions. Required: admin, Got: ${userRole}`);
    }
  }

  // CREATE - Admin only (now checked via headers from gateway)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Headers() headers: any
  ) {
    console.log('Create product headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.create(createProductDto);
  }

  // READ - Public access (no auth required)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(page, limit, category, search);
  }

  // READ - Public access (no auth required)
  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  // READ - Public access (no auth required)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // UPDATE - Admin only (now checked via headers from gateway)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @Headers() headers: any
  ) {
    console.log('Update product headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE - Admin only (now checked via headers from gateway)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers() headers: any
  ) {
    console.log('Delete product headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.remove(id);
  }

  // UPDATE STOCK - Admin only (now checked via headers from gateway)
  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Headers() headers: any
  ) {
    console.log('Update stock headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.updateStock(id, quantity);
  }

  // HARD DELETE - Admin only (now checked via headers from gateway)
  @Delete(':id/permanent')
  permanentRemove(
    @Param('id') id: string,
    @Headers() headers: any
  ) {
    console.log('Permanent delete headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.permanentRemove(id);
  }

  // RESTORE - Admin only (now checked via headers from gateway)
  @Patch(':id/restore')
  restore(
    @Param('id') id: string,
    @Headers() headers: any
  ) {
    console.log('Restore product headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.restore(id);
  }

  // GET all products including inactive (Admin only - now checked via headers)
  @Get('admin/all')
  async findAllAdmin(
    @Headers() headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    console.log('Admin all products headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.findAllAdmin(page, limit, category, search);
  }

  // GET product by ID including inactive (Admin only - now checked via headers)
  @Get('admin/:id')
  findOneAdmin(
    @Param('id') id: string,
    @Headers() headers: any
  ) {
    console.log('Admin product detail headers:', headers);
    this.checkAdminRole(headers);
    return this.productsService.findOne(id);
  }
}