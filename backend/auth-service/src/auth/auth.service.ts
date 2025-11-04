// Lokasi: auth-service/src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs'; // Pastikan Anda menggunakan bcryptjs atau bcrypt
// 1. Impor UsersService dan User entity
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    // 2. Inject UsersService
    private usersService: UsersService, 
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Kembalikan sebagai User entity untuk menyembunyikan password
      return new User(user);
    }
    return null;
  }

  // Fungsi login Anda sudah benar dan mengembalikan data lengkap
  async login(loginDto: { email: string; password: string }) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      // User entity sudah menyembunyikan password
      user: user, 
    };
  }

  // Fungsi register Anda sudah benar dan mengembalikan data lengkap
  async register(registerDto: { firstName: string; lastName: string; email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: new User(user), // Kembalikan sebagai User entity
    };
  }

  // 3. ===== PERBAIKAN UTAMA DI SINI =====
  async validateToken(token: string): Promise<User> { // Ubah return type
    let payload: any;
    try {
      // Verifikasi token
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Ambil userId (sub) dari payload
    const userId = payload.sub;
    
    // Gunakan UsersService untuk mengambil data user lengkap dari DB
    const user = await this.usersService.findById(userId); 

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Kembalikan objek User lengkap (entity User sudah @Exclude password)
    return user;
  }
}