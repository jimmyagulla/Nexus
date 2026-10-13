import { DocumentSentPresenter } from '../../../adapters/presenters/documents/document-sent.presenter';

export type DocumentSentPageComposition = {
  presenter: DocumentSentPresenter;
};

export function createDocumentSentPageComposition(): DocumentSentPageComposition {
  return { presenter: new DocumentSentPresenter() };
}
