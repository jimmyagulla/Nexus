import {
  ActorContext,
  SecondFactorStatus,
} from '@hexagonal-monorepo-template/domain';

export interface IGetSecondFactorStatus {
  execute(input: { actor: ActorContext }): Promise<SecondFactorStatus>;
}

export const IGetSecondFactorStatus = Symbol('IGetSecondFactorStatus');
