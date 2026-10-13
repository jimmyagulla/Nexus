import { createRoute } from '@tanstack/react-router';
import { accountComposition } from '../../di';
import { ActivationPage } from '../views/ActivationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const activationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.activation,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ActivationRoute,
});

function ActivationRoute() {
  const { token } = activationRoute.useSearch();
  return <ActivationPage invitationToken={token} deps={accountComposition} />;
}
