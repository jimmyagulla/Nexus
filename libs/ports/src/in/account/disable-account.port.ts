import {
  AccountSummary,
  ActorContext,
} from '@hexagonal-monorepo-template/domain';

export interface IDisableAccount {
  execute(input: {
    actor: ActorContext;
    accountId: string;
  }): Promise<AccountSummary>;
}

export const IDisableAccount = Symbol('IDisableAccount');
