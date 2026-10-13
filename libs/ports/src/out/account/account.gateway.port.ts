import {
  AccountSummary,
  InvitedAccount,
  SignedInSession,
} from '@hexagonal-monorepo-template/domain';

export interface IAccountGateway {
  activate(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void>;
  signIn(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession>;
  listByCompany(
    companyId: string,
    token: string,
  ): Promise<readonly AccountSummary[]>;
  invite(
    companyId: string,
    identifier: string,
    token: string,
  ): Promise<InvitedAccount>;
  disable(
    companyId: string,
    accountId: string,
    token: string,
  ): Promise<AccountSummary>;
  restore(
    companyId: string,
    accountId: string,
    token: string,
  ): Promise<AccountSummary>;
}

export const IAccountGateway = Symbol('IAccountGateway');
