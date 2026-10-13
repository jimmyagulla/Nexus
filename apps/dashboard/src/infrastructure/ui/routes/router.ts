import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { cabinetRoute } from './cabinet';
import { depositDocumentRoute } from './deposit-document';
import { exchangeRoute } from './exchange';
import { exchangesHistoryRoute } from './exchanges-history';
import { receivedDocumentsRoute } from './received-documents';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  cabinetRoute,
  receivedDocumentsRoute,
  depositDocumentRoute,
  exchangesHistoryRoute,
  exchangeRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
