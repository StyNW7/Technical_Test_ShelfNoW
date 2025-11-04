import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

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
    console.log('JWT Payload received:', payload);
    
    const userId = payload.sub || payload.userId;
    const email = payload.email;
    const role = payload.role || payload.roles?.[0];

    if (!userId || !email) {
      console.error('Invalid token payload:', payload);
      return null;
    }

    return { 
      userId: userId.toString(), 
      email: email, 
      role: role || 'user'
    };
  }
}