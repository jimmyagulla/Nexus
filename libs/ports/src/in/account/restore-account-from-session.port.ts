import { AccountSummary } from '@hexagonal-monorepo-template/domain';

export interface IRestoreAccountFromSession {
  execute(accountId: string): Promise<AccountSummary>;
}

export const IRestoreAccountFromSession = Symbol('IRestoreAccountFromSession');
