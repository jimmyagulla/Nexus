import { createRoute } from '@tanstack/react-router';
import { companySettingsComposition } from '../../di';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.settings,
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPage deps={companySettingsComposition} />;
}
