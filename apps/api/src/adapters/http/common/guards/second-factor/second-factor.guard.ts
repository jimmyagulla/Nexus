import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ErrorCode,
  requiresSecondFactor,
} from '@hexagonal-monorepo-template/domain';
import { AuthenticatedRequest } from '../authenticated-request';
import { ALLOW_WITHOUT_SECOND_FACTOR } from './allow-without-second-factor.decorator';

@Injectable()
export class SecondFactorGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.routeNeedsNoSecondFactor(context)) {
      return true;
    }

    const actor = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>().actor;
    if (
      actor !== undefined &&
      requiresSecondFactor(actor.role) &&
      actor.secondFactorVerified !== true
    ) {
      throw new ForbiddenException(ErrorCode.SECOND_FACTOR_REQUIRED);
    }

    return true;
  }

  private routeNeedsNoSecondFactor(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(ALLOW_WITHOUT_SECOND_FACTOR, [
        context.getHandler(),
        context.getClass(),
      ]) === true
    );
  }
}
