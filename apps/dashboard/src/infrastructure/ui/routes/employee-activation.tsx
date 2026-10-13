import { createRoute } from '@tanstack/react-router';
import { accountComposition } from '../../di';
import { EmployeeActivationPage } from '../views/EmployeeActivationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const employeeActivationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.employeeActivation,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: EmployeeActivationRoute,
});

function EmployeeActivationRoute() {
  const { token } = employeeActivationRoute.useSearch();
  return (
    <EmployeeActivationPage
      invitationToken={token}
      deps={accountComposition}
    />
  );
}
