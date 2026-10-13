import { AccountSummary } from '@hexagonal-monorepo-template/domain';

export interface IDisableAccountFromSession {
  execute(accountId: string): Promise<AccountSummary>;
}

export const IDisableAccountFromSession = Symbol('IDisableAccountFromSession');
