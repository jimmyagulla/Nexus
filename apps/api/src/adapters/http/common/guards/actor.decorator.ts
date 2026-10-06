import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActorContext, ErrorCode } from '@hexagonal-monorepo-template/domain';
import { AuthenticatedRequest } from './authenticated-request';

export const Actor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ActorContext => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.actor === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return request.actor;
  },
);
