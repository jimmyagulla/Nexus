import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { ALLOW_WITHOUT_COMPANY } from './allow-without-company.decorator';
import { AuthenticatedRequest } from './authenticated-request';

@Injectable()
export class CompanyScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowWithoutCompany = this.reflector.getAllAndOverride<boolean>(
      ALLOW_WITHOUT_COMPANY,
      [context.getHandler(), context.getClass()],
    );
    if (allowWithoutCompany) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const companyId = request.params?.companyId;
    if (companyId === undefined) {
      return true;
    }
    if (request.actor?.companyId !== companyId) {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }
    return true;
  }
}
