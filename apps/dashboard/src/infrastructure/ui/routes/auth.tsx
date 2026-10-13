import { createRoute } from '@tanstack/react-router';
import { LoginPage } from '../views/auth/LoginPage';
import { LoginVerificationPage } from '../views/auth/LoginVerificationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.login,
  component: LoginPage,
});

const loginVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.loginVerification,
  component: LoginVerificationPage,
});

export const authRoutes = [loginRoute, loginVerificationRoute];
