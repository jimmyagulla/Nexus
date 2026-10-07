import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../common/navigation/Layout';
import { Toaster } from '../shared/toaster';

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </>
  ),
});
