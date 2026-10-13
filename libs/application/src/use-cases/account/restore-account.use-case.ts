import {
  AccountSummary,
  ActorContext,
  requireCompanyAccount,
  requireEmployerCompany,
  toAccountSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IRestoreAccount,
} from '@hexagonal-monorepo-template/ports';

export class RestoreAccountUseCase implements IRestoreAccount {
  constructor(private readonly accounts: IAccountRepository) {}

  async execute(input: {
    actor: ActorContext;
    accountId: string;
  }): Promise<AccountSummary> {
    const companyAccounts = await this.accounts.listByCompany(
      requireEmployerCompany(input.actor),
    );
    const restored = requireCompanyAccount(
      companyAccounts,
      input.accountId,
    ).restore();
    await this.accounts.save(restored);
    return toAccountSummary(restored);
  }
}
