import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Headers,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Token is invalid' })
  async validateToken(@Headers() headers: any, @Res() res: Response) {
    try {
      // Get the Authorization header
      const authHeader = headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ 
          valid: false, 
          error: 'No authorization header' 
        });
      }

      // Extract the token from "Bearer <token>"
      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          valid: false, 
          error: 'No token provided' 
        });
      }

      // Validate the token using AuthService
      const payload = await this.authService.validateToken(token);
      
      return res.status(200).json({ 
        valid: true, 
        user: {
          userId: payload.sub,
          email: payload.email,
          role: payload.role || 'USER'
        }
      });
    } catch (error) {
      return res.status(401).json({ 
        valid: false, 
        error: error.message || 'Invalid token'
      });
    }
  }
}