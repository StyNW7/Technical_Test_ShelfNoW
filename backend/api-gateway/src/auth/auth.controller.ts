import { Controller, Post, UseGuards, Request } from '@nestjs/common';
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
    return {
      valid: true,
      user: req.user
    };
  }
}