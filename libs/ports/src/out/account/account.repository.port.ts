import { Account } from '@hexagonal-monorepo-template/domain';

export interface IAccountRepository {
  insert(account: Account): Promise<void>;
  save(account: Account): Promise<void>;
  listByCompany(companyId: string): Promise<readonly Account[]>;
  findByInvitationToken(invitationToken: string): Promise<Account | null>;
  findByIdentifier(identifier: string): Promise<Account | null>;
  findByEmployeeId(employeeId: string): Promise<Account | null>;
}

export const IAccountRepository = Symbol('IAccountRepository');
