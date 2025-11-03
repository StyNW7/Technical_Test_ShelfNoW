import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-key',
    });
  }

  async validate(payload: any) {
    // Validate token with auth service for additional security
    try {
      // For simplicity, we're just validating the JWT locally
      // In production, you might want to call auth service to validate
      return { 
        userId: payload.sub, 
        email: payload.email, 
        roles: payload.roles 
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}