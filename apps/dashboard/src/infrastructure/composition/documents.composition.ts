import { DocumentSentPresenter } from '../../adapters/presenters/documents/document-sent.presenter';
import { DocumentUploadPresenter } from '../../adapters/presenters/documents/document-upload.presenter';
import { DocumentsPresenter } from '../../adapters/presenters/documents/documents.presenter';
import { documentSentFixture, documentUploadFixture, documentsFixture } from '../ui/fixtures/documents.fixture';

export type DocumentsComposition = {
  documentsPresenter: DocumentsPresenter;
  documentUploadPresenter: DocumentUploadPresenter;
  documentSentPresenter: DocumentSentPresenter;
};

/** Presenters of the documents screens, fed with placeholder data for now. */
export function createDocumentsComposition(): DocumentsComposition {
  return {
    documentsPresenter: new DocumentsPresenter(documentsFixture),
    documentUploadPresenter: new DocumentUploadPresenter(documentUploadFixture),
    documentSentPresenter: new DocumentSentPresenter(documentSentFixture),
  };
}
