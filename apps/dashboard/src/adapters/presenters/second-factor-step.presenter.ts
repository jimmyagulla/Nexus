import {
  SecondFactorChallenge,
  SecondFactorStep,
} from '@hexagonal-monorepo-template/domain';

export type SecondFactorDestination = 'ENROLLMENT' | 'VERIFICATION' | 'SPACE';

export class SecondFactorStepPresenter {
  present(challenge: SecondFactorChallenge): SecondFactorDestination {
    switch (challenge.step) {
      case SecondFactorStep.ENROLL:
        return 'ENROLLMENT';
      case SecondFactorStep.VERIFY:
        return 'VERIFICATION';
      case SecondFactorStep.NONE:
        return 'SPACE';
    }
  }
}
