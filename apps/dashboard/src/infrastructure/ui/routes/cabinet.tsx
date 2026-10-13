import { createRoute } from '@tanstack/react-router';
import { cabinetExchangeComposition } from '../../di';
import { CabinetExchangesPage } from '../views/CabinetExchangesPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const cabinetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.cabinet,
  component: CabinetRoute,
});

function CabinetRoute() {
  return <CabinetExchangesPage deps={cabinetExchangeComposition} />;
}
