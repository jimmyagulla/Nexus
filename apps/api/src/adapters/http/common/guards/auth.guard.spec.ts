import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthGuardOptions } from './auth-guard-options';

describe('AuthGuard', () => {
  it('allows access when allowed is true', () => {
    const options: AuthGuardOptions = { allowed: true };
    const guard = new AuthGuard(options);

    const result = guard.canActivate();

    expect(result).toBe(true);
  });

  it('rejects an unauthenticated caller with 401', () => {
    const options: AuthGuardOptions = { allowed: false };
    const guard = new AuthGuard(options);

    expect(() => guard.canActivate()).toThrow(UnauthorizedException);
  });
});
