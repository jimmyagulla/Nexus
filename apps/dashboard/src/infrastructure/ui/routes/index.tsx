import { createRoute } from '@tanstack/react-router';
import { HomePage } from '../views/HomePage';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
