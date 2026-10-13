import { describe, expect, it } from 'vitest';
import {
  AccountStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { PrismaAccountRow, toAccount } from './prisma-account.mapper';

function rowOf(overrides: Partial<PrismaAccountRow> = {}): PrismaAccountRow {
  return {
    id: 'account-1',
    companyId: 'company-1',
    identifier: 'founder',
    role: UserRole.EMPLOYER,
    status: AccountStatus.INVITED,
    invitationToken: 'invite-1',
    secretHash: null,
    ...overrides,
  };
}

describe('toAccount', () => {
  it('maps a prisma row to an invited employer account', () => {
    const account = toAccount(rowOf());

    expect(account.id).toBe('account-1');
    expect(account.companyId).toBe('company-1');
    expect(account.identifier.value).toBe('founder');
    expect(account.role).toBe(UserRole.EMPLOYER);
    expect(account.status).toBe(AccountStatus.INVITED);
    expect(account.invitationToken).toBe('invite-1');
    expect(account.secretHash).toBeNull();
  });

  it('rejects a row whose identifier is empty', () => {
    expect(() => toAccount(rowOf({ identifier: '   ' }))).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
