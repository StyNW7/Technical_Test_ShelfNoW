// In your API Gateway: auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    console.log('RolesGuard - User:', user, 'Required roles:', requiredRoles);
    
    if (!user || !user.role) {
      throw new ForbiddenException('No user role found');
    }
    
    // Case insensitive role matching
    const userRoleNormalized = user.role.toLowerCase();
    const hasRole = requiredRoles.some((role) => 
      userRoleNormalized === role.toLowerCase()
    );
    
    console.log('RolesGuard - Has required role:', hasRole);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredRoles.join(', ')}, User role: ${user.role}`
      );
    }
    
    return true;
  }
}