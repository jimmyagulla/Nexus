import { SecondFactorVerification } from '@hexagonal-monorepo-template/domain';

export interface IVerifySecondFactorFromSession {
  execute(code: string): Promise<SecondFactorVerification>;
}

export const IVerifySecondFactorFromSession = Symbol(
  'IVerifySecondFactorFromSession',
);
