import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getAppConfig } from '../common/env/app-config';

type RequestWithHeaders = {
  headers?: Record<string, string | string[] | undefined>;
};

@Injectable()
export class AdminTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const header = request.headers?.['x-admin-token'];
    const providedToken = Array.isArray(header) ? header[0] : header;

    if (!providedToken || providedToken !== getAppConfig().adminToken) {
      throw new UnauthorizedException('invalid admin token');
    }

    return true;
  }
}
