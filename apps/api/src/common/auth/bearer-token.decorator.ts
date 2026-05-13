import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestWithHeaders = {
  headers?: Record<string, string | string[] | undefined>;
};

export const BearerToken = createParamDecorator((_, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest<RequestWithHeaders>();
  const authorization = request.headers?.authorization;
  const header = Array.isArray(authorization) ? authorization[0] : authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice('Bearer '.length);
});
