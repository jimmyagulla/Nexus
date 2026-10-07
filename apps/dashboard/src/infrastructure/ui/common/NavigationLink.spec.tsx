import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { AppRoutes } from '../routes/app-routes';
import { NavigationLink } from './NavigationLink';

async function renderAt(path: string, ui: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
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
  await screen.findByRole('link');
}

describe('NavigationLink', () => {
  it('points at the path it is given', async () => {
    await renderAt(
      AppRoutes.home,
      <NavigationLink
        to={AppRoutes.settings}
        icon={<span>icon</span>}
        label="Paramètres"
      />,
    );

    expect(
      screen.getByRole('link', { name: /Paramètres/ }).getAttribute('href'),
    ).toBe(AppRoutes.settings);
  });

  it('names the destination', async () => {
    await renderAt(
      AppRoutes.home,
      <NavigationLink
        to={AppRoutes.settings}
        icon={<span>icon</span>}
        label="Paramètres"
      />,
    );

    expect(screen.getByText('Paramètres')).toBeTruthy();
  });

  it('shows the icon it is given', async () => {
    await renderAt(
      AppRoutes.home,
      <NavigationLink
        to={AppRoutes.settings}
        icon={<span>Mon icône</span>}
        label="Paramètres"
      />,
    );

    expect(screen.getByText('Mon icône')).toBeTruthy();
  });

  it('marks itself as the current page when the browser sits on its path', async () => {
    await renderAt(
      AppRoutes.settings,
      <NavigationLink
        to={AppRoutes.settings}
        icon={<span>icon</span>}
        label="Paramètres"
      />,
    );

    expect(screen.getByRole('link', { current: 'page' })).toBeTruthy();
  });

  it('leaves itself unmarked when the browser sits elsewhere', async () => {
    await renderAt(
      AppRoutes.home,
      <NavigationLink
        to={AppRoutes.settings}
        icon={<span>icon</span>}
        label="Paramètres"
      />,
    );

    expect(screen.queryByRole('link', { current: 'page' })).toBeNull();
  });
});
