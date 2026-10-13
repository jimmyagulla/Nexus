import { SecondFactorEnrollmentConfirmation } from '@hexagonal-monorepo-template/domain';

export interface IConfirmSecondFactorEnrollmentFromSession {
  execute(code: string): Promise<SecondFactorEnrollmentConfirmation>;
}

export const IConfirmSecondFactorEnrollmentFromSession = Symbol(
  'IConfirmSecondFactorEnrollmentFromSession',
);
