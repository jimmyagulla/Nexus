import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { ROLES_KEY } from './roles.decorator';
import { AuthenticatedRequest } from '../authenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles === undefined || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.actor?.role === undefined || request.actor.role === null) {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }
    if (!roles.includes(request.actor.role)) {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }
    return true;
  }
}
