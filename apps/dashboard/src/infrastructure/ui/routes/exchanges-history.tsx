import { createRoute } from '@tanstack/react-router';
import { cabinetExchangeComposition } from '../../di';
import { ExchangesHistoryPage } from '../views/ExchangesHistoryPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const exchangesHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.exchangeHistory,
  component: ExchangesHistoryRoute,
});

function ExchangesHistoryRoute() {
  return <ExchangesHistoryPage deps={cabinetExchangeComposition} />;
}
