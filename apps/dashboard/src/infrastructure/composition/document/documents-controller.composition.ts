import {
  DepositDocumentsFromSessionUseCase,
  DownloadDocumentFromSessionUseCase,
  ListDocumentsFromSessionUseCase,
  ViewDocumentFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ApiDocumentGateway } from '../../../adapters/gateways/api-document.gateway';
import { DocumentsController } from '../../../adapters/controllers/documents.controller';
import { i18n } from '../../ui/i18n/i18n';

/** The documents controller, wired to the API: for the documents screen and the shell badge. */
export function createDocumentsController(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): DocumentsController {
  const documents = new ApiDocumentGateway(httpClient);
  const labels = i18n.messages.documents;
  return new DocumentsController(
    new ListDocumentsFromSessionUseCase(sessions, documents),
    new DepositDocumentsFromSessionUseCase(sessions, documents),
    new ViewDocumentFromSessionUseCase(sessions, documents),
    new DownloadDocumentFromSessionUseCase(sessions, documents),
    { categories: labels.categories, emitters: labels.emitters },
  );
}
