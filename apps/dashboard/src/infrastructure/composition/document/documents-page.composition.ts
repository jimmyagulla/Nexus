import {
  DepositDocumentsFromSessionUseCase,
  DownloadDocumentFromSessionUseCase,
  ListDocumentsFromSessionUseCase,
  ViewDocumentFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { ApiDocumentGateway } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { DocumentsController } from '../../../adapters/controllers/documents.controller';
import { DocumentUploadPresenter } from '../../../adapters/presenters/documents/document-upload.presenter';
import { DocumentsPresenter } from '../../../adapters/presenters/documents/documents.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../../ui/i18n/i18n';

export type DocumentsPageComposition = {
  controller: DocumentsController;
  presenter: DocumentsPresenter;
  uploadPresenter: DocumentUploadPresenter;
  errorPresenter: ErrorPresenter;
};

export function createDocumentsPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): DocumentsPageComposition {
  const documents = new ApiDocumentGateway(httpClient);
  const labels = i18n.messages.documents;

  return {
    controller: new DocumentsController(
      new ListDocumentsFromSessionUseCase(sessions, documents),
      new DepositDocumentsFromSessionUseCase(sessions, documents),
      new ViewDocumentFromSessionUseCase(sessions, documents),
      new DownloadDocumentFromSessionUseCase(sessions, documents),
      { categories: labels.categories, emitters: labels.emitters },
    ),
    presenter: new DocumentsPresenter(),
    uploadPresenter: new DocumentUploadPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
