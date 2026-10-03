import {
  CanActivate,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_GUARD_OPTIONS, AuthGuardOptions } from './auth-guard-options';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_GUARD_OPTIONS)
    private readonly options: AuthGuardOptions,
  ) {}

  canActivate(): boolean {
    if (!this.options.allowed) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
