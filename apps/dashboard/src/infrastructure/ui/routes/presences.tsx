import { createRoute } from '@tanstack/react-router';
import { presenceComposition } from '../../di';
import { PresencesPage } from '../views/PresencesPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const presencesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.presences,
  component: PresencesRoute,
});

function PresencesRoute() {
  return <PresencesPage deps={presenceComposition} />;
}
