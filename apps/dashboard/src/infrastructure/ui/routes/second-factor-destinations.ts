import type { SecondFactorDestination } from '../../../adapters/presenters/second-factor-step.presenter';
import { AppRoutes } from './app-routes';

export const SECOND_FACTOR_DESTINATIONS: Record<
  SecondFactorDestination,
  string
> = {
  ENROLLMENT: AppRoutes.secondFactorEnrollment,
  VERIFICATION: AppRoutes.secondFactorVerification,
  SPACE: AppRoutes.home,
};
