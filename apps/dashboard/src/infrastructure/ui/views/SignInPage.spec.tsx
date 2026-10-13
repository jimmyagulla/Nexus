import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { InMemoryHttpClient } from '@hexagonal-monorepo-template/adapters';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { createAccountComposition } from '../../composition/account.composition';
import { i18n } from '../i18n/i18n';
import { AppRoutes } from '../routes/app-routes';
import { Home } from './Home';
import { SignInPage } from './SignInPage';

async function renderSignIn(http: InMemoryHttpClient) {
  const deps = createAccountComposition(http);
  const rootRoute = createRootRoute();
  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: AppRoutes.home,
      component: Home,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: AppRoutes.signIn,
      component: () => (
        <QueryClientProvider client={new QueryClient()}>
          <SignInPage deps={deps} />
        </QueryClientProvider>
      ),
    }),
  ]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [AppRoutes.signIn] }),
  });

  render(<RouterProvider router={router} />);
  await screen.findByRole('heading', { name: i18n.messages.signIn.title });
}

describe('SignInPage', () => {
  it('opens the company space after a successful sign-in', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/sign-in', {
      status: 201,
      data: {
        accessToken: 'session:founder',
        companyId: 'company-1',
        role: UserRole.EMPLOYER,
      },
    });
    await renderSignIn(http);

    fireEvent.change(screen.getByLabelText(i18n.messages.signIn.identifier), {
      target: { value: 'founder' },
    });
    fireEvent.change(screen.getByLabelText(i18n.messages.signIn.secret), {
      target: { value: 's3cret' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.signIn.submit }),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: i18n.messages.home.title }),
      ).toBeTruthy(),
    );
  });
});
