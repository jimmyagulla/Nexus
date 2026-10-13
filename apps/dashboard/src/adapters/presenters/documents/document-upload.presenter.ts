import type { DocumentUploadViewModel } from './documents.view-models';

/**
 * Presents the document upload form.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentUploadPresenter {
  constructor(private readonly placeholder: DocumentUploadViewModel) {}

  present(): DocumentUploadViewModel {
    return this.placeholder;
  }
}
