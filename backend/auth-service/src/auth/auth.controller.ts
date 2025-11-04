import { Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_login')
  async login(@Payload(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('auth_register')
  async register(@Payload(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern('auth_get_profile')
  async getProfile(@Payload() user: { userId: string, email: string, role: string }) {
    return user; 
  }

  @MessagePattern('auth_validate_token')
  async validateToken(@Payload() data: { token: string }) {
    try {
      const payload = await this.authService.validateToken(data.token);
      return { 
        success: true, 
        data: {
          valid: true,
          user: {
            userId: payload.sub,
            email: payload.email,
            role: payload.role || 'USER'
          }
        }
      };
    } catch (error) {
      return { 
        success: false,
        message: error.message || 'Invalid token',
        statusCode: 401
      };
    }
  }
}