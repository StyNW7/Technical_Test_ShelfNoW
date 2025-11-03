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
    // Your JWT payload structure from auth service
    console.log('JWT Payload received:', payload);
    
    // Handle different possible payload structures
    const userId = payload.sub || payload.userId;
    const email = payload.email;
    const role = payload.role || payload.roles?.[0]; // Handle both 'role' and 'roles' array

    if (!userId || !email) {
      console.error('Invalid token payload:', payload);
      return null;
    }

    return { 
      userId: userId.toString(), 
      email: email, 
      role: role || 'user' // Default role if not provided
    };
  }
}