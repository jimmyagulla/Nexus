import {
  AccountSummary,
  ActorContext,
  requireEmployerCompany,
  toAccountSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IListCompanyAccounts,
} from '@hexagonal-monorepo-template/ports';

export class ListCompanyAccountsUseCase implements IListCompanyAccounts {
  constructor(private readonly accounts: IAccountRepository) {}

  async execute(input: {
    actor: ActorContext;
  }): Promise<readonly AccountSummary[]> {
    const companyAccounts = await this.accounts.listByCompany(
      requireEmployerCompany(input.actor),
    );
    return companyAccounts.map(toAccountSummary);
  }
}
