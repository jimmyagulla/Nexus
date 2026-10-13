import {
  ActorContext,
  SecondFactorVerification,
} from '@hexagonal-monorepo-template/domain';

export interface IVerifySecondFactor {
  execute(input: {
    actor: ActorContext;
    code: string;
  }): Promise<SecondFactorVerification>;
}

export const IVerifySecondFactor = Symbol('IVerifySecondFactor');
