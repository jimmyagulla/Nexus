import { describe, expect, it } from 'vitest';
import {
  AccountStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { toAccount } from './prisma-account.mapper';

describe('toAccount', () => {
  it('reads an employer account', () => {
    const account = toAccount({
      id: 'account-1',
      companyId: 'company-1',
      identifier: 'founder',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
      invitationToken: 'invite-1',
      secretHash: null,
    });

    expect(account.role).toBe(UserRole.EMPLOYER);
  });

  it('refuses a role outside the workspace', () => {
    expect(() =>
      toAccount({
        id: 'account-1',
        companyId: 'company-1',
        identifier: 'founder',
        role: 'ADMIN',
        status: AccountStatus.INVITED,
        invitationToken: 'invite-1',
        secretHash: null,
      }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
