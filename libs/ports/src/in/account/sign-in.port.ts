import { SignedInSession } from '@hexagonal-monorepo-template/domain';

export interface ISignIn {
  execute(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession>;
}

export const ISignIn = Symbol('ISignIn');
