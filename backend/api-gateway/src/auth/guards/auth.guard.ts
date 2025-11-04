import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    console.log('AuthGuard: Checking token', { 
      hasToken: !!token, 
      endpoint: request.url,
      method: request.method 
    });

    if (!token) {
      console.log('AuthGuard: No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      console.log('AuthGuard: Sending token to auth service for verification');
      const user = await this.authClient
        .send<JwtPayload>('auth_verify_token', { token })
        .toPromise();

      console.log('AuthGuard: Token validation result', { 
        hasUser: !!user, 
        userId: user?.userId,
        role: user?.role 
      });

      if (!user) {
        console.log('AuthGuard: Token verification returned no user');
        throw new UnauthorizedException('Invalid token');
      }

      // Ensure the user object has all required fields
      if (!user.userId || !user.email) {
        console.log('AuthGuard: User object missing required fields', user);
        throw new UnauthorizedException('Invalid user data in token');
      }

      request.user = user;
      console.log('AuthGuard: Token validated successfully for user:', user.email);
      return true;
    } catch (error) {
      console.error('AuthGuard: Token validation failed', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    console.log('AuthGuard: Authorization header', authHeader);
    
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}