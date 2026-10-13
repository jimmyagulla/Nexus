import { createRoute } from '@tanstack/react-router';
import { cabinetExchangeComposition } from '../../di';
import { DepositDocumentPage } from '../views/DepositDocumentPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const depositDocumentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.depositDocument,
  component: DepositDocumentRoute,
});

function DepositDocumentRoute() {
  return <DepositDocumentPage deps={cabinetExchangeComposition} />;
}
