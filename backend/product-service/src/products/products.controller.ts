import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorators';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE - Admin only
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
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

  // UPDATE - Admin only
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE - Admin only (soft delete)
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // UPDATE STOCK - Admin only
  @Patch(':id/stock')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  // HARD DELETE - Admin only (permanent delete)
  @Delete(':id/permanent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  permanentRemove(@Param('id') id: string) {
    return this.productsService.permanentRemove(id);
  }

  // RESTORE - Admin only (restore soft-deleted product)
  @Patch(':id/restore')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  restore(@Param('id') id: string) {
    return this.productsService.restore(id);
  }

  // GET all products including inactive (Admin only)
  @Get('admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async findAllAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAllAdmin(page, limit, category, search);
  }

  // GET product by ID including inactive (Admin only)
  @Get('admin/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findOneAdmin(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

}