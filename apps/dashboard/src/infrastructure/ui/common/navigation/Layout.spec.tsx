import { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { Workspace } from '@hexagonal-monorepo-template/domain';
import { AppRoutes } from '../../routes/app-routes';
import { i18n } from '../../i18n/i18n';
import { Layout } from './Layout';

async function renderLayoutAt(
  path: string,
  children: ReactNode,
  workspace?: Workspace,
) {
  const rootRoute = createRootRoute({
    component: () => <Layout workspace={workspace}>{children}</Layout>,
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
  await screen.findByRole('main');
}

describe('Layout', () => {
  it('offers the dashboard, the accounts and the settings as destinations', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(
      within(screen.getByRole('navigation'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([AppRoutes.home, AppRoutes.accounts, AppRoutes.settings]);
  });

  it('names its destinations in french', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(screen.getByText(i18n.messages.navigation.dashboard)).toBeTruthy();
    expect(screen.getByText(i18n.messages.navigation.accounts)).toBeTruthy();
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

  it('hides the employee space from the company workspace', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(screen.queryByText('Mon espace')).toBeNull();
  });

  it('does not open the employee space', async () => {
    await renderLayoutAt(AppRoutes.home, null, Workspace.EMPLOYEE);

    expect(screen.queryByText(i18n.messages.navigation.dashboard)).toBeNull();
    expect(screen.queryByText('Mon espace')).toBeNull();
  });

  it('does not open the accountant space', async () => {
    await renderLayoutAt(AppRoutes.home, null, Workspace.ACCOUNTANT);

    expect(screen.queryByText(i18n.messages.navigation.dashboard)).toBeNull();
    expect(screen.queryByText('Documents reçus')).toBeNull();
  });
});
