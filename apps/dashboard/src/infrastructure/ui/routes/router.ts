import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { secondFactorChallengeRoute } from './second-factor-challenge';
import { secondFactorEnrollmentRoute } from './second-factor-enrollment';
import { secondFactorVerificationRoute } from './second-factor-verification';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  secondFactorChallengeRoute,
  secondFactorEnrollmentRoute,
  secondFactorVerificationRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
