import { createRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { SecondFactorDestination } from '../../../adapters/presenters/second-factor-step.presenter';
import { secondFactorComposition } from '../../di';
import { SecondFactorChallengePage } from '../views/SecondFactorChallengePage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const DESTINATIONS: Record<SecondFactorDestination, string> = {
  ENROLLMENT: AppRoutes.secondFactorEnrollment,
  VERIFICATION: AppRoutes.secondFactorVerification,
  SPACE: AppRoutes.home,
};

export const secondFactorChallengeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.secondFactorChallenge,
  component: SecondFactorChallengeRoute,
});

function SecondFactorChallengeRoute() {
  const navigate = useNavigate();
  const onProceed = useCallback(
    (destination: SecondFactorDestination) => {
      void navigate({ to: DESTINATIONS[destination] });
    },
    [navigate],
  );

  return (
    <SecondFactorChallengePage
      deps={secondFactorComposition}
      onProceed={onProceed}
    />
  );
}
