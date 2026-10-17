import { describe, expect, it } from 'vitest';
import { ErrorCode } from '../errors/error-code';
import { UserRole } from '../identity/user-role';
import { requireOwnerScope } from './require-owner-scope';

describe('requireOwnerScope', () => {
  it('scopes an actor to their own records in their company', () => {
    expect(
      requireOwnerScope({ userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE }),
    ).toEqual({ companyId: 'c1', ownerId: 'u1' });
  });

  it('refuses an actor without a company', () => {
    expect(() =>
      requireOwnerScope({ userId: 'u1', companyId: null, role: UserRole.EMPLOYEE }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
