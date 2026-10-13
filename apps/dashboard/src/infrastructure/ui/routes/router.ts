import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { secondFactorEnrollmentRoute } from './second-factor-enrollment';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  secondFactorEnrollmentRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
