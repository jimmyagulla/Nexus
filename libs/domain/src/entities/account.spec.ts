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

  it('disables an active account and keeps its data', () => {
    const active = failedSignIns(2);

    const disabled = active.disable();

    expect(disabled.status).toBe(AccountStatus.DISABLED);
    expect(disabled.id).toBe('account-1');
    expect(disabled.companyId).toBe('company-1');
    expect(disabled.identifier.value).toBe('founder');
    expect(disabled.role).toBe(UserRole.EMPLOYER);
    expect(disabled.secretHash).toBe('hashed-secret');
    expect(active.status).toBe(AccountStatus.ACTIVE);
  });

  it('refuses to disable an invited account', () => {
    const invited = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    expect(() => invited.disable()).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses to disable an account that is already disabled', () => {
    expect(() => failedSignIns(0).disable().disable()).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('restores a disabled account with its secret and a clean failure count', () => {
    const disabled = failedSignIns(2).disable();

    const restored = disabled.restore();

    expect(restored.status).toBe(AccountStatus.ACTIVE);
    expect(restored.failedSignInCount).toBe(0);
    expect(restored.secretHash).toBe('hashed-secret');
    expect(disabled.status).toBe(AccountStatus.DISABLED);
  });

  it('restores a disabled account that had been locked', () => {
    const restored = failedSignIns(5).disable().restore();

    expect(restored.status).toBe(AccountStatus.ACTIVE);
    expect(restored.isLocked()).toBe(false);
  });

  it('restores an active account that is locked after five failures', () => {
    const locked = failedSignIns(5);

    const restored = locked.restore();

    expect(restored.status).toBe(AccountStatus.ACTIVE);
    expect(restored.failedSignInCount).toBe(0);
    expect(restored.isLocked()).toBe(false);
    expect(locked.isLocked()).toBe(true);
  });

  it('refuses to restore an active account that is not locked', () => {
    expect(() => failedSignIns(4).restore()).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses to restore an invited account', () => {
    const invited = Account.inviteEmployer(
      'account-1',
      'company-1',
      AccountIdentifier.parse('founder'),
      'invite-1',
    );

    expect(() => invited.restore()).toThrow(ErrorCode.ACCESS_DENIED);
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
