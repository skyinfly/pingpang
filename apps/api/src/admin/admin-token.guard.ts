import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getAppConfig } from '../common/env/app-config';

type RequestWithHeaders = {
  headers?: Record<string, string | string[] | undefined>;
};

@Injectable()
export class AdminTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const header = request.headers?.['x-admin-token'];
    const providedToken = Array.isArray(header) ? header[0] : header;

    if (!providedToken || providedToken !== getAppConfig().adminToken) {
      throw new UnauthorizedException('invalid admin token');
    }

    return true;
  }
}
