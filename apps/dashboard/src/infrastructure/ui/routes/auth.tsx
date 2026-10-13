import { createRoute } from '@tanstack/react-router';
import {
  authComposition,
} from '../../di';
import { LoginPage } from '../views/auth/LoginPage';
import { LoginVerificationPage } from '../views/auth/LoginVerificationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.login,
  component: () => <LoginPage deps={authComposition.login} />,
});

const loginVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.loginVerification,
  component: () => <LoginVerificationPage deps={authComposition.loginVerification} />,
});

export const authRoutes = [loginRoute, loginVerificationRoute];
