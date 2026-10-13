import { createRoute } from '@tanstack/react-router';
import { companyAccountsComposition } from '../../di';
import { CompanyAccountsPage } from '../views/CompanyAccountsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.accounts,
  component: AccountsRoute,
});

function AccountsRoute() {
  return <CompanyAccountsPage deps={companyAccountsComposition} />;
}
