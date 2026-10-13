import {
  SecondFactorChallenge,
  SecondFactorEnrollment,
  SecondFactorEnrollmentConfirmation,
  SecondFactorVerification,
} from '@hexagonal-monorepo-template/domain';

export interface ISecondFactorGateway {
  openChallenge(token: string): Promise<SecondFactorChallenge>;
  beginEnrollment(token: string): Promise<SecondFactorEnrollment>;
  confirmEnrollment(
    code: string,
    token: string,
  ): Promise<SecondFactorEnrollmentConfirmation>;
  verify(code: string, token: string): Promise<SecondFactorVerification>;
}

export const ISecondFactorGateway = Symbol('ISecondFactorGateway');
