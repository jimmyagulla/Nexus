import { useMemo } from 'react';
import { createRoute } from '@tanstack/react-router';
import { AppRoutes } from '@hexagonal-monorepo-template/ports';
import { getCompanySettingsComposition } from '../../di';
import { SettingsPage } from '../views/SettingsPage';
import { rootRoute } from './__root';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.settings,
  component: SettingsRoute,
});

function SettingsRoute() {
  const deps = useMemo(() => getCompanySettingsComposition(), []);
  return <SettingsPage deps={deps} />;
}
