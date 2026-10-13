import {
  ActorContext,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';

export interface IConfirmSecondFactorEnrollment {
  execute(input: {
    actor: ActorContext;
    code: string;
  }): Promise<SecondFactorEnrollmentConfirmation>;
}

export const IConfirmSecondFactorEnrollment = Symbol(
  'IConfirmSecondFactorEnrollment',
);
