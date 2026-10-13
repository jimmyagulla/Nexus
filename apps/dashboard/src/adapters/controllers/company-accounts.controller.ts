import {
  AccountSummary,
  InvitedAccount,
} from '@hexagonal-monorepo-template/domain';
import {
  IDisableAccountFromSession,
  IInviteEmployerFromSession,
  IListCompanyAccountsFromSession,
  IRestoreAccountFromSession,
} from '@hexagonal-monorepo-template/ports';

export class CompanyAccountsController {
  constructor(
    private readonly listFromSession: IListCompanyAccountsFromSession,
    private readonly inviteFromSession: IInviteEmployerFromSession,
    private readonly disableFromSession: IDisableAccountFromSession,
    private readonly restoreFromSession: IRestoreAccountFromSession,
  ) {}

  listAccounts(): Promise<readonly AccountSummary[]> {
    return this.listFromSession.execute();
  }

  inviteEmployer(identifier: string): Promise<InvitedAccount> {
    return this.inviteFromSession.execute(identifier);
  }

  disableAccount(accountId: string): Promise<AccountSummary> {
    return this.disableFromSession.execute(accountId);
  }

  restoreAccount(accountId: string): Promise<AccountSummary> {
    return this.restoreFromSession.execute(accountId);
  }
}
