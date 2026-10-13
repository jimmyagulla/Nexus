import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { cabinetRoute } from './cabinet';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  cabinetRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
