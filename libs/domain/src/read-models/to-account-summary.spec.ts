import { Account } from '../entities/account';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { toAccountSummary } from './to-account-summary';

describe('toAccountSummary', () => {
  it('keeps the identifier, the role and the status', () => {
    const account = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    expect(toAccountSummary(account)).toEqual({
      id: 'account-1',
      identifier: 'founder',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
    });
  });

  it('never carries the secret nor the invitation', () => {
    const account = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    ).activate('hashed-secret');

    expect(Object.keys(toAccountSummary(account)).sort()).toEqual([
      'id',
      'identifier',
      'role',
      'status',
    ]);
  });
});
