import { Injectable, Inject, CanActivate } from '@nestjs/common';
import { AUTH_GUARD_OPTIONS, AuthGuardOptions } from './auth-guard-options';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_GUARD_OPTIONS)
    private readonly options: AuthGuardOptions,
  ) {}

  canActivate(): boolean {
    return this.options.allowed;
  }
}
