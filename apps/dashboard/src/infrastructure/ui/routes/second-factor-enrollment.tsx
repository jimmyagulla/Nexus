import { createRoute } from '@tanstack/react-router';
import { secondFactorComposition } from '../../di';
import { SecondFactorEnrollmentPage } from '../views/SecondFactorEnrollmentPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const secondFactorEnrollmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.secondFactorEnrollment,
  component: SecondFactorEnrollmentRoute,
});

function SecondFactorEnrollmentRoute() {
  return <SecondFactorEnrollmentPage deps={secondFactorComposition} />;
}
