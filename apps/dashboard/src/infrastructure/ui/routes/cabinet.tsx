import { createRoute, useNavigate } from '@tanstack/react-router';
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
  const navigate = useNavigate();

  return (
    <CabinetExchangesPage
      deps={cabinetExchangeComposition}
      onOpen={(exchangeId) =>
        void navigate({ to: AppRoutes.exchange, params: { exchangeId } })
      }
    />
  );
}
