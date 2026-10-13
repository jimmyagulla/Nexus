import { ErrorCode } from '../errors/error-code';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { Account } from './account';

function failedSignIns(count: number): Account {
  let account = Account.inviteEmployer(
    'account-1',
    'company-1',
    AccountIdentifier.parse('founder'),
    'invite-1',
  ).activate('hashed-secret');
  for (let i = 0; i < count; i += 1) {
    account = account.recordFailedSignIn();
  }
  return account;
}

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

  it('starts with no failed sign-in', () => {
    const account = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    expect(account.failedSignInCount).toBe(0);
    expect(account.isLocked()).toBe(false);
  });

  it('counts a failed sign-in', () => {
    const account = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    ).activate('hashed-secret');

    const afterOne = account.recordFailedSignIn();

    expect(afterOne.failedSignInCount).toBe(1);
    expect(account.failedSignInCount).toBe(0);
  });

  it('stays unlocked after four failed sign-ins', () => {
    const account = failedSignIns(4);

    expect(account.isLocked()).toBe(false);
  });

  it('locks after five failed sign-ins', () => {
    const account = failedSignIns(5);

    expect(account.isLocked()).toBe(true);
  });

  it('clears failed sign-ins after a successful connection', () => {
    const account = failedSignIns(4).clearFailedSignIns();

    expect(account.failedSignInCount).toBe(0);
    expect(account.isLocked()).toBe(false);
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

  describe('reissuing an invitation', () => {
    function invitedEmployee(): Account {
      return Account.inviteEmployee(
        'account-2',
        'company-1',
        AccountIdentifier.parse('alice'),
        'invite-2',
        'employee-7',
      );
    }

    it('replaces the invitation of an account still invited, keeping the account', () => {
      const reissued = invitedEmployee().reissueInvitation(
        'invite-3',
        AccountIdentifier.parse('alice'),
      );

      expect(reissued.invitationToken).toBe('invite-3');
      expect(reissued.status).toBe(AccountStatus.INVITED);
      expect(reissued.id).toBe('account-2');
      expect(reissued.companyId).toBe('company-1');
      expect(reissued.role).toBe(UserRole.EMPLOYEE);
      expect(reissued.employeeId).toBe('employee-7');
      expect(reissued.secretHash).toBeNull();
    });

    it('applies the identifier submitted with the new invitation', () => {
      const reissued = invitedEmployee().reissueInvitation(
        'invite-3',
        AccountIdentifier.parse('alice.martin'),
      );

      expect(reissued.identifier.value).toBe('alice.martin');
    });

    it('leaves the first invitation holder with nothing to use', () => {
      const original = invitedEmployee();

      original.reissueInvitation('invite-3', AccountIdentifier.parse('alice'));

      expect(original.invitationToken).toBe('invite-2');
    });

    it('refuses to reissue once the account is active', () => {
      const active = invitedEmployee().activate('hashed-secret');

      expect(() =>
        active.reissueInvitation('invite-3', AccountIdentifier.parse('alice')),
      ).toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    });

    it('refuses a blank invitation token', () => {
      expect(() =>
        invitedEmployee().reissueInvitation(
          '   ',
          AccountIdentifier.parse('alice'),
        ),
      ).toThrow(ErrorCode.REQUIRED_INFORMATION);
    });
  });

  it('invites an employee as an invited account bound to one employee record', () => {
    const account = Account.inviteEmployee(
      'account-2',
      'company-1',
      AccountIdentifier.parse('alice'),
      'invite-2',
      'employee-7',
    );

    expect(account.role).toBe(UserRole.EMPLOYEE);
    expect(account.status).toBe(AccountStatus.INVITED);
    expect(account.companyId).toBe('company-1');
    expect(account.employeeId).toBe('employee-7');
    expect(account.invitationToken).toBe('invite-2');
    expect(account.secretHash).toBeNull();
  });
});
