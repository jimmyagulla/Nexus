import { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { AppRoutes } from '@hexagonal-monorepo-template/ports';
import { i18n } from '../../i18n/i18n';
import { Layout } from './Layout';

async function renderLayoutAt(path: string, children: ReactNode) {
  const rootRoute = createRootRoute({
    component: () => <Layout>{children}</Layout>,
  });
  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: AppRoutes.home,
      component: () => null,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: AppRoutes.settings,
      component: () => null,
    }),
  ]);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  render(<RouterProvider router={router} />);
  await screen.findByRole('navigation');
}

describe('Layout', () => {
  it('offers the dashboard and the settings as destinations', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(
      within(screen.getByRole('navigation'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([AppRoutes.home, AppRoutes.settings]);
  });

  it('names its destinations in french', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(screen.getByText(i18n.messages.navigation.dashboard)).toBeTruthy();
    expect(screen.getByText(i18n.messages.navigation.settings)).toBeTruthy();
  });

  it('shows the content it wraps', async () => {
    await renderLayoutAt(AppRoutes.home, <p>Contenu de la page</p>);

    expect(
      within(screen.getByRole('main')).getByText('Contenu de la page'),
    ).toBeTruthy();
  });

  it('marks the destination the browser sits on', async () => {
    await renderLayoutAt(AppRoutes.settings, null);

    expect(
      screen.getByRole('link', { current: 'page' }).getAttribute('href'),
    ).toBe(AppRoutes.settings);
  });

  it('marks the dashboard when the browser sits on the home page', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(
      screen.getByRole('link', { current: 'page' }).getAttribute('href'),
    ).toBe(AppRoutes.home);
  });
});
