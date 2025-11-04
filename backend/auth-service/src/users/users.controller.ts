import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/user-role-enum';

interface AuthenticatedPayload {
  user: {
    userId: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  id?: string;
  updateData?: Partial<User>;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private checkAdmin(payload: AuthenticatedPayload): void {
    if (!payload.user || payload.user.role?.toLowerCase() !== 'admin') {
      throw new Error('Forbidden: Admin access required');
    }
  }

  @MessagePattern('admin_get_all_users')
  async findAll(@Payload() payload: AuthenticatedPayload): Promise<User[]> {
    this.checkAdmin(payload); 
    return this.usersService.findAll();
  }

  @MessagePattern('admin_get_user_by_id')
  async findOne(@Payload() payload: AuthenticatedPayload): Promise<User> {
    this.checkAdmin(payload);
    if (!payload.id) {
      throw new Error('User ID is required');
    }
    return this.usersService.findById(payload.id);
  }

  @MessagePattern('admin_update_user')
  async update(@Payload() payload: AuthenticatedPayload): Promise<User> {
    this.checkAdmin(payload);
    if (!payload.id || !payload.updateData) {
      throw new Error('User ID and updateData are required');
    }
    return this.usersService.updateUser(payload.id, payload.updateData);
  }

  @MessagePattern('admin_delete_user')
  async remove(@Payload() payload: AuthenticatedPayload): Promise<void> {
    this.checkAdmin(payload);
    if (!payload.id) {
      throw new Error('User ID is required');
    }
    return this.usersService.deleteUser(payload.id);
  }
}