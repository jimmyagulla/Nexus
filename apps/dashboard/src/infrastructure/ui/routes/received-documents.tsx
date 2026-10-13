import { createRoute, useNavigate } from '@tanstack/react-router';
import { cabinetExchangeComposition } from '../../di';
import { ReceivedDocumentsPage } from '../views/ReceivedDocumentsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const receivedDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.receivedDocuments,
  component: ReceivedDocumentsRoute,
});

function ReceivedDocumentsRoute() {
  const navigate = useNavigate();

  return (
    <ReceivedDocumentsPage
      deps={cabinetExchangeComposition}
      onOpen={(exchangeId) =>
        void navigate({ to: AppRoutes.exchange, params: { exchangeId } })
      }
    />
  );
}
