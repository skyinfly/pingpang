import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { SessionUser } from '../../auth/dev-auth';
import { UsersService } from '../../users/users.service';

type RequestWithHeaders = {
  headers?: Record<string, string | string[] | undefined>;
  authenticatedUser?: SessionUser;
};

@Injectable()
export class DevBearerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authorization = request.headers?.authorization;
    const bearerToken = Array.isArray(authorization) ? authorization[0] : authorization;

    if (!bearerToken?.startsWith('Bearer ')) {
      throw new UnauthorizedException('missing bearer token');
    }

    const token = bearerToken.slice('Bearer '.length);
    request.authenticatedUser = await this.usersService.getProfileByToken(token);
    return true;
  }
}