import { DocumentUploadPresenter } from '../../adapters/presenters/documents/document-upload.presenter';

export type DocumentUploadComposition = {
  presenter: DocumentUploadPresenter;
};

export function createDocumentUploadComposition(): DocumentUploadComposition {
  return { presenter: new DocumentUploadPresenter() };
}
