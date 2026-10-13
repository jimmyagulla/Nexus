import { DocumentUploadPresenter } from '../../../adapters/presenters/documents/document-upload.presenter';

export type DocumentUploadPageComposition = {
  presenter: DocumentUploadPresenter;
};

export function createDocumentUploadPageComposition(): DocumentUploadPageComposition {
  return { presenter: new DocumentUploadPresenter() };
}
