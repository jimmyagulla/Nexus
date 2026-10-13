import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';

export interface IBeginSecondFactorEnrollmentFromSession {
  execute(): Promise<SecondFactorEnrollment>;
}

export const IBeginSecondFactorEnrollmentFromSession = Symbol(
  'IBeginSecondFactorEnrollmentFromSession',
);
