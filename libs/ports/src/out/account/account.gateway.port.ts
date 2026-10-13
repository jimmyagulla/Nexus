import { SignedInSession } from '@hexagonal-monorepo-template/domain';

export interface IAccountGateway {
  activate(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void>;
  signIn(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession>;
}

export const IAccountGateway = Symbol('IAccountGateway');
