import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { parametresRoute } from './parametres';
import { rootRoute } from './__root';

const routeTree = rootRoute.addChildren([indexRoute, parametresRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
