import { createRoute, useNavigate } from '@tanstack/react-router';
import { cabinetExchangeComposition } from '../../di';
import { ExchangeDetailPage } from '../views/ExchangeDetailPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const exchangeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.exchange,
  component: ExchangeRoute,
});

function ExchangeRoute() {
  const { exchangeId } = exchangeRoute.useParams();
  const navigate = useNavigate();

  return (
    <ExchangeDetailPage
      deps={cabinetExchangeComposition}
      exchangeId={exchangeId}
      onBack={() => void navigate({ to: AppRoutes.cabinet })}
    />
  );
}
