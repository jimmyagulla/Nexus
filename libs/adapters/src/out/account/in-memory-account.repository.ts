import { Account } from '@hexagonal-monorepo-template/domain';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryAccountRepository implements IAccountRepository {
  constructor(private readonly accounts = new Map<string, Account>()) {}

  async insert(account: Account): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async save(account: Account): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async listByCompany(companyId: string): Promise<readonly Account[]> {
    return [...this.accounts.values()].filter(
      (account) => account.companyId === companyId,
    );
  }

  async findByInvitationToken(
    invitationToken: string,
  ): Promise<Account | null> {
    return (
      [...this.accounts.values()].find(
        (account) => account.invitationToken === invitationToken,
      ) ?? null
    );
  }
}
