import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private prisma = new PrismaClient();

  async create(createProductDto: CreateProductDto) {
    try {
      // Check if ISBN already exists (if provided)
      if (createProductDto.isbn) {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            isbn: createProductDto.isbn,
            isActive: true,
          },
        });

        if (existingProduct) {
          throw new ConflictException('A product with this ISBN already exists');
        }
      }

      return await this.prisma.product.create({
        data: {
          ...createProductDto,
          isActive: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('A product with this ISBN already exists');
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    includeInactive: boolean = false
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};

    // Only show active products by default
    if (!includeInactive) {
      where.isActive = true;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      // Check if ISBN already exists for other products (if provided)
      if (updateProductDto.isbn) {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            isbn: updateProductDto.isbn,
            id: { not: id },
            isActive: true,
          },
        });

        if (existingProduct) {
          throw new ConflictException('A product with this ISBN already exists');
        }
      }

      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A product with this ISBN already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Soft delete by setting isActive to false
      return await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async permanentRemove(id: string) {
    try {
      // Permanent delete from database
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async restore(id: string) {
    try {
      // Restore soft-deleted product
      return await this.prisma.product.update({
        where: { id },
        data: { isActive: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getCategories() {
    const categories = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map(c => c.category);
  }

  async updateStock(id: string, quantity: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      return await this.prisma.product.update({
        where: { id },
        data: { stock: newStock },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  }

  // Get all products including inactive (for admin)
  async findAllAdmin(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ) {
    return this.findAll(page, limit, category, search, true);
  }
}