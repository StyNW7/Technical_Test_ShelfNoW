import { Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_login')
  async login(@Payload(ValidationPipe) loginDto: LoginDto) {
    try {
      const data = await this.authService.login(loginDto);
      return { success: true, data };
    } catch (e) {
      return { success: false, message: e.message, statusCode: e.status || 401 };
    }
  }

  @MessagePattern('auth_register')
  async register(@Payload(ValidationPipe) registerDto: RegisterDto) {
    try {
      const data = await this.authService.register(registerDto);
      return { success: true, data };
    } catch (e) {
      return { success: false, message: e.message, statusCode: e.status || 409 };
    }
  }

  @MessagePattern('auth_get_profile')
  async getProfile(@Payload() user: { userId: string, email: string, role: string }) {
    return { success: true, data: user };
  }

  @MessagePattern('auth_validate_token')
  async validateToken(@Payload() data: { token: string }) {
    try {
      const user: User = await this.authService.validateToken(data.token); 
      
      return { 
        success: true, 
        data: {
          valid: true,
          user: {
            userId: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName, 
            lastName: user.lastName,
          }
        }
      };
    } catch (error) {
      return { 
        success: false,
        message: error.message || 'Invalid token',
        statusCode: error.status || 401
      };
    }
  }
}