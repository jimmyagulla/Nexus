import { AuthGuard } from './auth.guard';
import { AuthGuardOptions } from './auth-guard-options';

describe('AuthGuard', () => {
  it('allows access when allowed is true', () => {
    const options: AuthGuardOptions = { allowed: true };
    const guard = new AuthGuard(options);

    const result = guard.canActivate();

    expect(result).toBe(true);
  });

  it('denies access when allowed is false', () => {
    const options: AuthGuardOptions = { allowed: false };
    const guard = new AuthGuard(options);

    const result = guard.canActivate();

    expect(result).toBe(false);
  });
});
