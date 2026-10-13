import { AccountSummary } from '@hexagonal-monorepo-template/domain';

export interface IListCompanyAccountsFromSession {
  execute(): Promise<readonly AccountSummary[]>;
}

export const IListCompanyAccountsFromSession = Symbol(
  'IListCompanyAccountsFromSession',
);
