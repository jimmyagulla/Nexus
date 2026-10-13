import {
  AccountSummary,
  ActorContext,
} from '@hexagonal-monorepo-template/domain';

export interface IRestoreAccount {
  execute(input: {
    actor: ActorContext;
    accountId: string;
  }): Promise<AccountSummary>;
}

export const IRestoreAccount = Symbol('IRestoreAccount');
