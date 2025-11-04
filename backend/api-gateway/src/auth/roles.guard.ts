import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './interfaces/auth.interface';
import { ROLES_KEY } from './roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('RolesGuard: Checking roles', { 
      requiredRoles, 
      endpoint: context.switchToHttp().getRequest().url 
    });

    if (!requiredRoles) {
      console.log('RolesGuard: No roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    console.log('RolesGuard: User info', { 
      userId: user?.userId, 
      userRole: user?.role,
      userEmail: user?.email 
    });

    if (!user) {
      console.log('RolesGuard: No user found in request');
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    console.log('RolesGuard: Role check result', { hasRole });

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}