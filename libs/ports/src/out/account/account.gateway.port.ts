import {
  SecondFactorEnrollmentOffer,
  SignedInSession,
} from '@hexagonal-monorepo-template/domain';

export interface IAccountGateway {
  activate(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void>;
  activateEmployee(input: {
    invitationToken: string;
    secret: string;
  }): Promise<SecondFactorEnrollmentOffer>;
  signIn(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession>;
}

export const IAccountGateway = Symbol('IAccountGateway');
