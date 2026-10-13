import { SecondFactorChallenge } from '@hexagonal-monorepo-template/domain';

export interface IOpenSecondFactorChallengeFromSession {
  execute(): Promise<SecondFactorChallenge>;
}

export const IOpenSecondFactorChallengeFromSession = Symbol(
  'IOpenSecondFactorChallengeFromSession',
);
