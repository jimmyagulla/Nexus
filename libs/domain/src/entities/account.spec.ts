import { ErrorCode } from '../errors/error-code';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { Account } from './account';

describe('Account', () => {
  it('opens the first employer as invited', () => {
    const account = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    expect(account.id).toBe('account-1');
    expect(account.companyId).toBe('company-1');
    expect(account.identifier.value).toBe('founder');
    expect(account.role).toBe(UserRole.EMPLOYER);
    expect(account.status).toBe(AccountStatus.INVITED);
    expect(account.invitationToken).toBe('invite-1');
    expect(account.secretHash).toBeNull();
  });

  it('activates with the chosen secret hash and consumes the invitation', () => {
    const invited = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    const activated = invited.activate('hashed-secret');

    expect(activated.status).toBe(AccountStatus.ACTIVE);
    expect(activated.invitationToken).toBeNull();
    expect(activated.secretHash).toBe('hashed-secret');
    expect(invited.status).toBe(AccountStatus.INVITED);
  });

  it('refuses to activate an account whose invitation is already consumed', () => {
    const activated = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    ).activate('hashed-secret');

    expect(() => activated.activate('other')).toThrow(
      ErrorCode.INVITATION_INVALID,
    );
  });
});
