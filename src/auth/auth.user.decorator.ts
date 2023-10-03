import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
