import {
  AccountSummary,
  ActorContext,
  assertEmployerRemainsActive,
  requireCompanyAccount,
  requireEmployerCompany,
  toAccountSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IDisableAccount,
} from '@hexagonal-monorepo-template/ports';

export class DisableAccountUseCase implements IDisableAccount {
  constructor(private readonly accounts: IAccountRepository) {}

  async execute(input: {
    actor: ActorContext;
    accountId: string;
  }): Promise<AccountSummary> {
    const companyAccounts = await this.accounts.listByCompany(
      requireEmployerCompany(input.actor),
    );
    const target = requireCompanyAccount(companyAccounts, input.accountId);
    const disabled = target.disable();
    assertEmployerRemainsActive(companyAccounts, target);
    await this.accounts.save(disabled);
    return toAccountSummary(disabled);
  }
}
