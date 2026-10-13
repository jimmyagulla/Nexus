import { DocumentSentPresenter } from '../../adapters/presenters/documents/document-sent.presenter';

export type DocumentSentComposition = {
  presenter: DocumentSentPresenter;
};

export function createDocumentSentComposition(): DocumentSentComposition {
  return { presenter: new DocumentSentPresenter() };
}
