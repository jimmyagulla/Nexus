import { createRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { secondFactorComposition } from '../../di';
import { SecondFactorVerificationPage } from '../views/SecondFactorVerificationPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const secondFactorVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.secondFactorVerification,
  component: SecondFactorVerificationRoute,
});

function SecondFactorVerificationRoute() {
  const navigate = useNavigate();
  const onVerified = useCallback(() => {
    void navigate({ to: AppRoutes.home });
  }, [navigate]);

  return (
    <SecondFactorVerificationPage
      deps={secondFactorComposition}
      onVerified={onVerified}
    />
  );
}
