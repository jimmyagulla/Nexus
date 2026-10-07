import { ErrorCode } from '../errors/error-code';
import { UserRole } from '../identity/user-role';
import { requireCompanyScopedSession } from './require-company-scoped-session';

const actor = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('requireCompanyScopedSession', () => {
  it('returns the token and the company of the actor', () => {
    expect(requireCompanyScopedSession('token', actor)).toEqual({
      token: 'token',
      companyId: 'c1',
    });
  });

  it('refuses a session without token', () => {
    expect(() => requireCompanyScopedSession(null, actor)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses a session without actor', () => {
    expect(() => requireCompanyScopedSession('token', null)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an actor not bound to a company', () => {
    expect(() =>
      requireCompanyScopedSession('token', { ...actor, companyId: null }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
