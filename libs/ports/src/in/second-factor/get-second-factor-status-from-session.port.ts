import { SecondFactorStatus } from '@hexagonal-monorepo-template/domain';

export interface IGetSecondFactorStatusFromSession {
  execute(): Promise<SecondFactorStatus>;
}

export const IGetSecondFactorStatusFromSession = Symbol(
  'IGetSecondFactorStatusFromSession',
);
