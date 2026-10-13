import { createRootRoute, Outlet } from '@tanstack/react-router';
import { navigationComposition } from '../../di';
import { AppShell } from '../common/navigation/AppShell';
import { Toaster } from '../shared/toaster';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppShell deps={navigationComposition}>
        <Outlet />
      </AppShell>
      <Toaster />
    </>
  ),
});
