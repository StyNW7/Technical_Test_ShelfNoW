import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
// Ganti PrismaClient dengan PrismaService (asumsi dari PrismaModule Anda)
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // Inject PrismaService, jangan buat instance baru
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // ... (sisa logika Anda SAMA PERSIS, tidak perlu diubah) ...
      if (!createProductDto.title || !createProductDto.author || !createProductDto.description) {
        throw new BadRequestException('Title, author, and description are required');
      }

      if (createProductDto.isbn) {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            isbn: createProductDto.isbn,
          },
        });

        if (existingProduct) {
          throw new ConflictException('A product with this ISBN already exists');
        }
      }
      
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          // Pastikan DTO Anda memiliki properti ini
          isActive: createProductDto.isActive !== undefined ? createProductDto.isActive : true,
        },
      });

      return product;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('A product with this ISBN already exists');
      }
      throw error;
    }
  }

  // ... (findAll, findOne, update, remove, dll. SAMA PERSIS) ...
  // ... Tidak perlu mengubah logika bisnis Anda ...
  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    includeInactive: boolean = false
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};

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
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      if (updateProductDto.isbn) {
        const productWithSameIsbn = await this.prisma.product.findFirst({
          where: {
            isbn: updateProductDto.isbn,
            id: { not: id },
          },
        });

        if (productWithSameIsbn) {
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
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
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
        throw new BadRequestException('Insufficient stock');
      }

      return await this.prisma.product.update({
        where: { id },
        data: { stock: newStock },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update stock: ${error.message}`);
    }
  }

  async findAllAdmin(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ) {
    return this.findAll(page, limit, category, search, true);
  }
}