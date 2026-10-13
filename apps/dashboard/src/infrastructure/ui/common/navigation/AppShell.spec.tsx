import { render, screen, within } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { createNavigationComposition } from '../../../composition/navigation.composition';
import { AppRoutes } from '../../routes/app-routes';
import { AppShell } from './AppShell';

async function renderShellAs(role: UserRole) {
  const deps = createNavigationComposition(
    new InMemorySessionGateway('jwt', {
      userId: 'u1',
      companyId: 'c1',
      role,
    }),
  );
  const rootRoute = createRootRoute({
    component: () => (
      <AppShell deps={deps}>
        <p>Contenu</p>
      </AppShell>
    ),
  });
  const routeTree = rootRoute.addChildren(
    [AppRoutes.home, AppRoutes.settings, AppRoutes.cabinet, AppRoutes.receivedDocuments].map(
      (path) =>
        createRoute({
          getParentRoute: () => rootRoute,
          path,
          component: () => null,
        }),
    ),
  );
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider
        router={createRouter({
          routeTree,
          history: createMemoryHistory({ initialEntries: [AppRoutes.home] }),
        })}
      />
    </QueryClientProvider>,
  );
  await screen.findByRole('navigation');
}

describe('AppShell', () => {
  it('offers the employer the destinations of the company', async () => {
    await renderShellAs(UserRole.EMPLOYER);

    expect(
      await within(screen.getByRole('navigation')).findByText(
        'Cabinet comptable',
      ),
    ).toBeTruthy();
  });

  it('offers the cabinet its documents, not the settings of the company', async () => {
    await renderShellAs(UserRole.ACCOUNTANT);

    expect(
      await within(screen.getByRole('navigation')).findByText('Documents reçus'),
    ).toBeTruthy();
    expect(screen.queryByText('Paramètres')).toBeNull();
  });

  it('shows the page it wraps', async () => {
    await renderShellAs(UserRole.EMPLOYER);

    expect(screen.getByText('Contenu')).toBeTruthy();
  });
});
