import { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import type { NavigationEntryViewModel } from '../../../../adapters/presenters/navigation.presenter';
import { AppRoutes } from '../../routes/app-routes';
import { Layout } from './Layout';

const employerEntries: NavigationEntryViewModel[] = [
  { id: 'dashboard', to: AppRoutes.home, label: 'Tableau de bord' },
  { id: 'settings', to: AppRoutes.settings, label: 'Paramètres' },
  { id: 'cabinet', to: AppRoutes.cabinet, label: 'Cabinet comptable' },
];

const cabinetEntries: NavigationEntryViewModel[] = [
  {
    id: 'receivedDocuments',
    to: AppRoutes.receivedDocuments,
    label: 'Documents reçus',
  },
];

async function renderLayoutAt(
  path: string,
  children: ReactNode,
  entries: NavigationEntryViewModel[] = employerEntries,
) {
  const rootRoute = createRootRoute({
    component: () => <Layout entries={entries}>{children}</Layout>,
  });
  const routeTree = rootRoute.addChildren(
    [
      AppRoutes.home,
      AppRoutes.settings,
      AppRoutes.cabinet,
      AppRoutes.receivedDocuments,
    ].map((routePath) =>
      createRoute({
        getParentRoute: () => rootRoute,
        path: routePath,
        component: () => null,
      }),
    ),
  );

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  render(<RouterProvider router={router} />);
  await screen.findByRole('navigation');
}

describe('Layout', () => {
  it('offers the destinations it is given, in that order', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(
      within(screen.getByRole('navigation'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([AppRoutes.home, AppRoutes.settings, AppRoutes.cabinet]);
  });

  it('names its destinations as given', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    for (const entry of employerEntries) {
      expect(screen.getByText(entry.label)).toBeTruthy();
    }
  });

  it('offers the cabinet only the documents it received', async () => {
    await renderLayoutAt(AppRoutes.receivedDocuments, null, cabinetEntries);

    expect(
      within(screen.getByRole('navigation'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([AppRoutes.receivedDocuments]);
    expect(screen.queryByText('Paramètres')).toBeNull();
  });

  it('offers no destination until it is given some', async () => {
    await renderLayoutAt(AppRoutes.home, null, []);

    expect(
      within(screen.getByRole('navigation')).queryAllByRole('link'),
    ).toEqual([]);
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

  it('marks the accounting firm when the browser sits on its page', async () => {
    await renderLayoutAt(AppRoutes.cabinet, null);

    expect(
      screen.getByRole('link', { current: 'page' }).getAttribute('href'),
    ).toBe(AppRoutes.cabinet);
  });

  it('marks the dashboard when the browser sits on the home page', async () => {
    await renderLayoutAt(AppRoutes.home, null);

    expect(
      screen.getByRole('link', { current: 'page' }).getAttribute('href'),
    ).toBe(AppRoutes.home);
  });
});
