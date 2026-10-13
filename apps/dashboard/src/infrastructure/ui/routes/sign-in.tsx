import { createRoute } from '@tanstack/react-router';
import { accountComposition } from '../../di';
import { SignInPage } from '../views/SignInPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.signIn,
  component: SignInRoute,
});

function SignInRoute() {
  return <SignInPage deps={accountComposition} />;
}
