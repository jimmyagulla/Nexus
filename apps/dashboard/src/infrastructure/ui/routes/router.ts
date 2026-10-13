import { createRouter } from '@tanstack/react-router';
import { accountsRoute } from './accounts';
import { activationRoute } from './activation';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { settingsRoute } from './settings';
import { signInRoute } from './sign-in';

const routeTree = rootRoute.addChildren([
  indexRoute,
  accountsRoute,
  settingsRoute,
  activationRoute,
  signInRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
