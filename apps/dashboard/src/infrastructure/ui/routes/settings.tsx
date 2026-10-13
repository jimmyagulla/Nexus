import { createRoute } from '@tanstack/react-router';
import { companySettingsComposition, secondFactorComposition } from '../../di';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';
import { requireSecondFactor } from './require-second-factor';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.settings,
  beforeLoad: () => requireSecondFactor(secondFactorComposition),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsPage deps={companySettingsComposition} />;
}
