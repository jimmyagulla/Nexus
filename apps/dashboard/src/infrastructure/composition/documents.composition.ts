import { DocumentsPresenter } from '../../adapters/presenters/documents/documents.presenter';

export type DocumentsComposition = {
  presenter: DocumentsPresenter;
};

export function createDocumentsComposition(): DocumentsComposition {
  return { presenter: new DocumentsPresenter() };
}
