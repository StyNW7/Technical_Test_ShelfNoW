// Lokasi: auth-service/src/auth/auth.controller.ts

import { Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity'; // Impor User entity

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Fungsi login Anda sudah benar
  @MessagePattern('auth_login')
  async login(@Payload(ValidationPipe) loginDto: LoginDto) {
    try {
      const data = await this.authService.login(loginDto);
      return { success: true, data };
    } catch (e) {
      return { success: false, message: e.message, statusCode: e.status || 401 };
    }
  }

  // Fungsi register Anda sudah benar
  @MessagePattern('auth_register')
  async register(@Payload(ValidationPipe) registerDto: RegisterDto) {
    try {
      const data = await this.authService.register(registerDto);
      return { success: true, data };
    } catch (e) {
      return { success: false, message: e.message, statusCode: e.status || 409 };
    }
  }

  // Fungsi getProfile Anda sudah benar
  @MessagePattern('auth_get_profile')
  async getProfile(@Payload() user: { userId: string, email: string, role: string }) {
    return { success: true, data: user };
  }

  // ===== PERBAIKAN UTAMA DI SINI =====
  @MessagePattern('auth_validate_token')
  async validateToken(@Payload() data: { token: string }) {
    try {
      // 1. Service sekarang mengembalikan objek User lengkap
      const user: User = await this.authService.validateToken(data.token); 
      
      // 2. Kembalikan format yang diharapkan frontend, dengan data lengkap
      return { 
        success: true, 
        data: {
          valid: true,
          user: {
            userId: user.id, // Gunakan user.id
            email: user.email,
            role: user.role,
            firstName: user.firstName, // <-- DATA LENGKAP
            lastName: user.lastName,   // <-- DATA LENGKAP
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