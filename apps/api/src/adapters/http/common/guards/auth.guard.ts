import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { AuthenticatedRequest } from './authenticated-request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(IJwtVerifier)
    private readonly jwt: IJwtVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if ((request.url ?? '').includes('/docs')) {
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
