import { Account, ErrorCode } from '@hexagonal-monorepo-template/domain';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryAccountRepository implements IAccountRepository {
  constructor(private readonly accounts = new Map<string, Account>()) {}

  async insert(account: Account): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async save(account: Account): Promise<void> {
    this.accounts.set(account.id, account);
  }

  async consumeInvitation(
    activated: Account,
    invitationToken: string,
  ): Promise<void> {
    const stored = this.accounts.get(activated.id);
    if (stored === undefined || stored.invitationToken !== invitationToken) {
      throw new Error(ErrorCode.INVITATION_INVALID);
    }
    this.accounts.set(activated.id, activated);
  }

  async listByCompany(companyId: string): Promise<readonly Account[]> {
    return [...this.accounts.values()].filter(
      (account) => account.companyId === companyId,
    );
  }

  async findById(accountId: string): Promise<Account | null> {
    return this.accounts.get(accountId) ?? null;
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

  async findByEmployeeId(employeeId: string): Promise<Account | null> {
    return (
      [...this.accounts.values()].find(
        (account) => account.employeeId === employeeId,
      ) ?? null
    );
  }

  async findByIdentifier(identifier: string): Promise<Account | null> {
    return (
      [...this.accounts.values()].find(
        (account) => account.identifier.value === identifier,
      ) ?? null
    );
  }
}
