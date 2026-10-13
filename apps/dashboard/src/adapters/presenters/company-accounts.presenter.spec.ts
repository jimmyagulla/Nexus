import { describe, expect, it } from 'vitest';
import {
  AccountStatus,
  AccountSummary,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../../infrastructure/ui/i18n/i18n';
import { CompanyAccountsPresenter } from './company-accounts.presenter';

function account(overrides: Partial<AccountSummary>): AccountSummary {
  return {
    id: 'account-1',
    identifier: 'founder',
    role: UserRole.EMPLOYER,
    status: AccountStatus.ACTIVE,
    locked: false,
    ...overrides,
  };
}

function rowOf(overrides: Partial<AccountSummary>) {
  const [row] = new CompanyAccountsPresenter().present([account(overrides)]).rows;
  return row;
}

describe('CompanyAccountsPresenter', () => {
  it('names the identifier, the role and the status of each account', () => {
    expect(rowOf({})).toMatchObject({
      id: 'account-1',
      identifier: 'founder',
      roleLabel: i18n.messages.accounts.roles.EMPLOYER,
      statusLabel: i18n.messages.accounts.statuses.ACTIVE,
    });
  });

  it('keeps the order of the accounts', () => {
    const view = new CompanyAccountsPresenter().present([
      account({ id: 'a', identifier: 'alpha' }),
      account({ id: 'b', identifier: 'beta' }),
    ]);

    expect(view.rows.map((row) => row.identifier)).toEqual(['alpha', 'beta']);
  });

  it('offers to disable an active account only', () => {
    expect(rowOf({ status: AccountStatus.ACTIVE })).toMatchObject({
      canDisable: true,
      canRestore: false,
    });
    expect(rowOf({ status: AccountStatus.INVITED })).toMatchObject({
      canDisable: false,
      canRestore: false,
    });
  });

  it('offers to restore a disabled account', () => {
    expect(rowOf({ status: AccountStatus.DISABLED })).toMatchObject({
      canDisable: false,
      canRestore: true,
    });
  });

  it('offers to restore a locked account and says why it cannot sign in', () => {
    expect(rowOf({ locked: true })).toMatchObject({
      canDisable: true,
      canRestore: true,
      blockedMessage: i18n.messages.errors.ACCOUNT_LOCKED,
    });
  });

  it('says nothing about a sign-in block on an account that is not locked', () => {
    expect(rowOf({})?.blockedMessage).toBeNull();
  });

  it('presents the activation link to hand over to an invited employer', () => {
    const invitation = new CompanyAccountsPresenter().presentInvitation({
      id: 'account-2',
      identifier: 'colleague',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
      invitationToken: 'invite-2',
    });

    expect(invitation).toEqual({
      identifier: 'colleague',
      activationPath: '/activation?token=invite-2',
    });
  });

  it('encodes the invitation token in the activation link', () => {
    const invitation = new CompanyAccountsPresenter().presentInvitation({
      id: 'account-2',
      identifier: 'colleague',
      role: UserRole.EMPLOYER,
      status: AccountStatus.INVITED,
      invitationToken: 'a b&c',
    });

    expect(invitation.activationPath).toBe('/activation?token=a%20b%26c');
  });

  it('exposes nothing but display data', () => {
    expect(Object.keys(rowOf({}) ?? {}).sort()).toEqual([
      'blockedMessage',
      'canDisable',
      'canRestore',
      'id',
      'identifier',
      'roleLabel',
      'statusLabel',
    ]);
  });
});
