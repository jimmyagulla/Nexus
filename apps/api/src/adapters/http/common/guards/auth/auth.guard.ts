import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { localDevActor } from '@hexagonal-monorepo-template/adapters';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { API_CONFIG, type ApiConfig } from '../../../../../infrastructure/config/load-api-config';
import { AuthenticatedRequest } from '../authenticated-request';
import { IS_PUBLIC } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(IJwtVerifier)
    private readonly jwt: IJwtVerifier,
    @Optional()
    @Inject(API_CONFIG)
    private readonly config?: Pick<ApiConfig, 'authDisabled'>,
    @Optional()
    private readonly reflector?: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector?.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]) === true
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if ((request.url ?? '').includes('/docs')) {
      return true;
    }

    if (this.config?.authDisabled === true) {
      request.actor = localDevActor;
      return true;
    }

    const header = request.headers.authorization;
    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }

    try {
      request.actor = await this.jwt.verify(header.slice('Bearer '.length));
      return true;
    } catch {
      throw new ForbiddenException(ErrorCode.ACCESS_DENIED);
    }
  }
}
