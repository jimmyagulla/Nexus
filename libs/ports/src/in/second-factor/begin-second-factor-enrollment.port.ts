import {
  ActorContext,
  SecondFactorEnrollment,
} from '@hexagonal-monorepo-template/domain';

export interface IBeginSecondFactorEnrollment {
  execute(input: { actor: ActorContext }): Promise<SecondFactorEnrollment>;
}

export const IBeginSecondFactorEnrollment = Symbol(
  'IBeginSecondFactorEnrollment',
);
