import { Account } from '@hexagonal-monorepo-template/domain';

export interface IAccountRepository {
  insert(account: Account): Promise<void>;
  save(account: Account): Promise<void>;
  /**
   * Stores the activated account only if the stored one still carries the
   * invitation, so that one invitation activates one account once.
   * Throws INVITATION_INVALID otherwise.
   */
  consumeInvitation(activated: Account, invitationToken: string): Promise<void>;
  listByCompany(companyId: string): Promise<readonly Account[]>;
  findById(accountId: string): Promise<Account | null>;
  findByInvitationToken(invitationToken: string): Promise<Account | null>;
  findByIdentifier(identifier: string): Promise<Account | null>;
  findByEmployeeId(employeeId: string): Promise<Account | null>;
}

export const IAccountRepository = Symbol('IAccountRepository');
