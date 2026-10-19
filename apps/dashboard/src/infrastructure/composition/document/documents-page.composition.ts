import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { DocumentsController } from '../../../adapters/controllers/documents.controller';
import { CharacterCounterPresenter } from '../../../adapters/presenters/documents/character-counter.presenter';
import { CountLabelPresenter } from '../../../adapters/presenters/documents/count-label.presenter';
import { DepositConfirmationPresenter } from '../../../adapters/presenters/documents/deposit-confirmation.presenter';
import { DocumentActiveFiltersPresenter } from '../../../adapters/presenters/documents/document-active-filters.presenter';
import { DocumentFiltersPresenter } from '../../../adapters/presenters/documents/document-filters.presenter';
import { DocumentListSummaryPresenter } from '../../../adapters/presenters/documents/document-list-summary.presenter';
import { DocumentRowPresenter } from '../../../adapters/presenters/documents/document-row.presenter';
import { DocumentSortPresenter } from '../../../adapters/presenters/documents/document-sort.presenter';
import { DocumentTypeOptionsPresenter } from '../../../adapters/presenters/documents/document-type-options.presenter';
import { DocumentUploadPresenter } from '../../../adapters/presenters/documents/document-upload.presenter';
import { FileSizePresenter } from '../../../adapters/presenters/documents/file-size.presenter';
import { UploadedFilePresenter } from '../../../adapters/presenters/documents/uploaded-file.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { RemoteFileReader } from '../../network/remote-file-reader';
import type { SeenItemsStore } from '../../ui/stores/seen-items.store';
import { createDocumentsController } from './documents-controller.composition';

/** Presenters of the documents list: one per view model. */
export type DocumentsListPresenters = {
  summary: DocumentListSummaryPresenter;
  activeFilters: DocumentActiveFiltersPresenter;
  filters: DocumentFiltersPresenter;
  sort: DocumentSortPresenter;
  row: DocumentRowPresenter;
};

/** Presenters of the upload form: one per view model. */
export type DocumentUploadPresenters = {
  form: DocumentUploadPresenter;
  typeOptions: DocumentTypeOptionsPresenter;
  uploadedFile: UploadedFilePresenter;
  counter: CharacterCounterPresenter;
  confirmation: DepositConfirmationPresenter;
};

export type DocumentsPageComposition = {
  controller: DocumentsController;
  listPresenters: DocumentsListPresenters;
  uploadPresenters: DocumentUploadPresenters;
  errorPresenter: ErrorPresenter;
  /** Reads the file behind the link of a viewed or downloaded document. */
  files: RemoteFileReader;
  /** Documents opened or downloaded on this device. */
  seenDocuments: SeenItemsStore;
};

export function createDocumentsPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
  seenDocuments: SeenItemsStore,
): DocumentsPageComposition {
  const sizes = new FileSizePresenter();
  const counts = new CountLabelPresenter();

  return {
    controller: createDocumentsController(httpClient, sessions),
    listPresenters: {
      summary: new DocumentListSummaryPresenter(counts),
      activeFilters: new DocumentActiveFiltersPresenter(),
      filters: new DocumentFiltersPresenter(counts),
      sort: new DocumentSortPresenter(),
      row: new DocumentRowPresenter(sizes),
    },
    uploadPresenters: {
      form: new DocumentUploadPresenter(),
      typeOptions: new DocumentTypeOptionsPresenter(),
      uploadedFile: new UploadedFilePresenter(sizes),
      counter: new CharacterCounterPresenter(),
      confirmation: new DepositConfirmationPresenter(),
    },
    errorPresenter: new ErrorPresenter(),
    files: new RemoteFileReader(httpClient),
    seenDocuments,
  };
}
