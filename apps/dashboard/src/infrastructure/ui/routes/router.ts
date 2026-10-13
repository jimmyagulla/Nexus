import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { authRoutes } from './auth';
import { employeeRoutes } from './employee';
import { employerRoutes } from './employer';

const routeTree = rootRoute.addChildren([
  ...authRoutes,
  employeeRoutes,
  employerRoutes,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
