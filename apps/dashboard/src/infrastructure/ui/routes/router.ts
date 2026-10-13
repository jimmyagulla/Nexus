import { createRouter } from '@tanstack/react-router';
import { activationRoute } from './activation';
import { employeeActivationRoute } from './employee-activation';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { settingsRoute } from './settings';
import { signInRoute } from './sign-in';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  activationRoute,
  employeeActivationRoute,
  signInRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
