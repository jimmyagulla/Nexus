import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { presencesRoute } from './presences';
import { rootRoute } from './__root';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  presencesRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
