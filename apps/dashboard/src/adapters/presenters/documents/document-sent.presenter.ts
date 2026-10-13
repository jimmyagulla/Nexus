import type { DocumentSentViewModel } from './documents.view-models';

/**
 * Presents the document sent confirmation.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentSentPresenter {
  constructor(private readonly placeholder: DocumentSentViewModel) {}

  present(): DocumentSentViewModel {
    return this.placeholder;
  }
}
