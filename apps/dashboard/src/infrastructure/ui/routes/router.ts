import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
