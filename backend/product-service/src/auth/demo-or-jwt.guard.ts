import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DemoOrJwtGuard implements CanActivate {
  private demoToken = process.env.ADMIN_BYPASS_TOKEN || 'demo-admin-token';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const authHeader: string | undefined = req.headers?.authorization || req.headers?.Authorization;
    if (authHeader) {
      const [, tokenRaw] = authHeader.split(' ') as [string | undefined, string | undefined];
      const token = tokenRaw ?? authHeader;
      if (token === this.demoToken) {
        return true;
      }
    }

    const JwtGuardClass: any = AuthGuard('jwt') as any;
    const jwtGuard = new JwtGuardClass();
    return jwtGuard.canActivate(context) as Promise<boolean>;
  }
}
