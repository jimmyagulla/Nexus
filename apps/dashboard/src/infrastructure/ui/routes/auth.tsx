import { createRoute } from '@tanstack/react-router';
import {
  loginComposition,
  loginVerificationComposition,
} from '../../di';
import { LoginPage } from '../views/auth/LoginPage';
import { LoginVerificationPage } from '../views/auth/LoginVerificationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.login,
  component: () => <LoginPage deps={loginComposition} />,
});

const loginVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.loginVerification,
  component: () => <LoginVerificationPage deps={loginVerificationComposition} />,
});

export const authRoutes = [loginRoute, loginVerificationRoute];
