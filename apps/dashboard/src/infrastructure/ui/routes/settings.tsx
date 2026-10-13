import { createRoute } from '@tanstack/react-router';
import { companySettingsComposition, expenseCategoriesComposition } from '../../di';
import { ExpenseCategoriesPage } from '../views/ExpenseCategoriesPage';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.settings,
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <div className="space-y-8">
      <SettingsPage deps={companySettingsComposition} />
      <ExpenseCategoriesPage deps={expenseCategoriesComposition} />
    </div>
  );
}
