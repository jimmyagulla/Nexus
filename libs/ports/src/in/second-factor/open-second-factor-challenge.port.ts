import {
  ActorContext,
  SecondFactorChallenge,
} from '@hexagonal-monorepo-template/domain';

export interface IOpenSecondFactorChallenge {
  execute(input: { actor: ActorContext }): Promise<SecondFactorChallenge>;
}

export const IOpenSecondFactorChallenge = Symbol('IOpenSecondFactorChallenge');
