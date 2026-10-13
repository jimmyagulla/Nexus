import { createRoute } from '@tanstack/react-router';
import { secondFactorComposition } from '../../di';
import { HomePage } from '../views/HomePage';
import { rootRoute } from './__root';
import { requireSecondFactor } from './require-second-factor';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => requireSecondFactor(secondFactorComposition),
  component: HomePage,
});
