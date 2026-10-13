import { Account } from '../entities/account';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { toAccountSummary } from './to-account-summary';

function invitedFounder(): Account {
  return Account.inviteEmployer(
    'account-1',
    'company-1',
    AccountIdentifier.parse('founder'),
    'invite-1',
  );
}

describe('toAccountSummary', () => {
  it('keeps the identifier, the role and the status', () => {
    expect(toAccountSummary(invitedFounder())).toEqual({
      id: 'account-1',
      identifier: 'founder',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
      locked: false,
    });
  });

  it('flags an account locked after five failed sign-ins', () => {
    let account = invitedFounder().activate('hashed-secret');
    for (let i = 0; i < 5; i += 1) {
      account = account.recordFailedSignIn();
    }

    expect(toAccountSummary(account)).toMatchObject({
      status: AccountStatus.ACTIVE,
      locked: true,
    });
  });

  it('never carries the secret nor the invitation', () => {
    const account = invitedFounder().activate('hashed-secret');

    expect(Object.keys(toAccountSummary(account)).sort()).toEqual([
      'id',
      'identifier',
      'locked',
      'role',
      'status',
    ]);
  });
});
