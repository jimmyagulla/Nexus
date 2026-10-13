import { SecondFactorEnrollmentOffer } from '@hexagonal-monorepo-template/domain';

export interface IActivateEmployeeAccount {
  execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<SecondFactorEnrollmentOffer>;
}

export const IActivateEmployeeAccount = Symbol('IActivateEmployeeAccount');
