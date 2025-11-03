import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    
    // Handle different possible payload structures
    const userId = payload.sub || payload.userId;
    const email = payload.email;
    const role = payload.role || payload.roles?.[0];

    if (!userId || !email || !role) {
      console.error('Invalid token payload:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }

    return { 
      userId: userId.toString(), 
      email: email, 
      role: role 
    };
  }
}