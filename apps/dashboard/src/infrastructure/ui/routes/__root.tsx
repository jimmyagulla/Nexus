import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '../shared/toaster';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});
