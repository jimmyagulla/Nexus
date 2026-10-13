import { DocumentsPresenter } from '../../../adapters/presenters/documents/documents.presenter';

export type DocumentsPageComposition = {
  presenter: DocumentsPresenter;
};

export function createDocumentsPageComposition(): DocumentsPageComposition {
  return { presenter: new DocumentsPresenter() };
}
