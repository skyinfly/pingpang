import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SessionUser } from '../../auth/dev-auth';

type RequestWithAuthUser = {
  authenticatedUser?: SessionUser;
};

export const AuthUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithAuthUser>();
  return request.authenticatedUser;
});
