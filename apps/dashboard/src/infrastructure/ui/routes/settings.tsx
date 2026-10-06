import { createRoute } from '@tanstack/react-router';
import { AppRoutes } from '@hexagonal-monorepo-template/ports';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';
import { companySettingsController } from '../../../di';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.settings,
  component: () => (
    <SettingsPage controller={companySettingsController} />
  ),
});
