import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../common/Layout';
import { Toaster } from '../shared/toaster';

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </>
  ),
});
