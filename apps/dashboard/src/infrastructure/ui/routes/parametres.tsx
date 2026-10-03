import { createRoute } from '@tanstack/react-router';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';

export const parametresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parametres',
  component: SettingsPage,
});
