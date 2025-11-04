import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/user-role-enum';

// Interface untuk payload yang dikirim dari gateway
interface AuthenticatedPayload {
  user: {
    userId: string;
    email: string;
    role: string;
  };
  // Properti lain bisa ditambahkan di sini
  id?: string; // Untuk findOne, update, delete
  updateData?: Partial<User>; // Untuk update
}

@Controller() // Hapus ('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Helper untuk memeriksa role admin dari payload
  private checkAdmin(payload: AuthenticatedPayload): void {
    if (!payload.user || payload.user.role?.toLowerCase() !== 'admin') {
      throw new Error('Forbidden: Admin access required');
    }
  }

  /**
   * Menggantikan @Get()
   * @Roles(UserRole.ADMIN)
   */
  @MessagePattern('admin_get_all_users')
  async findAll(@Payload() payload: AuthenticatedPayload): Promise<User[]> {
    this.checkAdmin(payload); // Keamanan lapisan kedua
    return this.usersService.findAll();
  }

  /**
   * Menggantikan @Get(':id')
   */
  @MessagePattern('admin_get_user_by_id')
  async findOne(@Payload() payload: AuthenticatedPayload): Promise<User> {
    this.checkAdmin(payload);
    // Asumsi gateway mengirim 'id' di dalam payload
    if (!payload.id) {
      throw new Error('User ID is required');
    }
    return this.usersService.findById(payload.id);
  }

  /**
   * Menggantikan @Put(':id')
   */
  @MessagePattern('admin_update_user')
  async update(@Payload() payload: AuthenticatedPayload): Promise<User> {
    this.checkAdmin(payload);
    if (!payload.id || !payload.updateData) {
      throw new Error('User ID and updateData are required');
    }
    return this.usersService.updateUser(payload.id, payload.updateData);
  }

  /**
   * Menggantikan @Delete(':id')
   * @Roles(UserRole.ADMIN)
   */
  @MessagePattern('admin_delete_user')
  async remove(@Payload() payload: AuthenticatedPayload): Promise<void> {
    this.checkAdmin(payload);
    if (!payload.id) {
      throw new Error('User ID is required');
    }
    return this.usersService.deleteUser(payload.id);
  }
}