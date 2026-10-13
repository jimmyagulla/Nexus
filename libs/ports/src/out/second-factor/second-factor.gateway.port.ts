import {
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';

export interface ISecondFactorGateway {
  beginEnrollment(token: string): Promise<SecondFactorEnrollment>;
  confirmEnrollment(
    code: string,
    token: string,
  ): Promise<SecondFactorEnrollmentConfirmation>;
}

export const ISecondFactorGateway = Symbol('ISecondFactorGateway');
