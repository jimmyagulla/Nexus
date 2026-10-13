import { describe, expect, it } from 'vitest';
import {
  AccountStatus,
  AccountSummary,
  InvitedAccount,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CompanyAccountsController } from './company-accounts.controller';

const summary: AccountSummary = {
  id: 'account-1',
  identifier: 'founder',
  role: UserRole.EMPLOYER,
  status: AccountStatus.ACTIVE,
  locked: false,
};

const invited: InvitedAccount = {
  id: 'account-2',
  identifier: 'colleague',
  role: UserRole.EMPLOYER,
  status: AccountStatus.INVITED,
  invitationToken: 'invite-2',
};

function controller(): CompanyAccountsController {
  return new CompanyAccountsController(
    { execute: async () => [summary] },
    { execute: async () => invited },
    { execute: async (accountId) => ({ ...summary, id: accountId }) },
    { execute: async (accountId) => ({ ...summary, id: accountId }) },
  );
}

describe('CompanyAccountsController', () => {
  it('lists the accounts of the company', async () => {
    await expect(controller().listAccounts()).resolves.toEqual([summary]);
  });

  it('invites an employer', async () => {
    await expect(controller().inviteEmployer('colleague')).resolves.toEqual(
      invited,
    );
  });

  it('disables the account it is given', async () => {
    await expect(controller().disableAccount('account-9')).resolves.toMatchObject(
      { id: 'account-9' },
    );
  });

  it('restores the account it is given', async () => {
    await expect(controller().restoreAccount('account-9')).resolves.toMatchObject(
      { id: 'account-9' },
    );
  });
});
