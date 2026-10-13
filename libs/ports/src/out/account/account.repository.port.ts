import { Account } from '@hexagonal-monorepo-template/domain';

export interface IAccountRepository {
  insert(account: Account): Promise<void>;
  listByCompany(companyId: string): Promise<readonly Account[]>;
}

export const IAccountRepository = Symbol('IAccountRepository');
