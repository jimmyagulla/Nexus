import {
  AccountSummary,
  ActorContext,
} from '@hexagonal-monorepo-template/domain';

export interface IListCompanyAccounts {
  execute(input: { actor: ActorContext }): Promise<readonly AccountSummary[]>;
}

export const IListCompanyAccounts = Symbol('IListCompanyAccounts');
