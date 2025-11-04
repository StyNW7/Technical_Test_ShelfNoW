import { Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  private authClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'auth-service',
        port: 3001,
      },
    });
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  async validateToken(@Request() req) {
    try {
      console.log('AuthController: Validating token for user', req.user);
      
      return {
        valid: true,
        user: req.user
      };
    } catch (error) {
      console.error('AuthController: Validation error', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Token validation failed',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}