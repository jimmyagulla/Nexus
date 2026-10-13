import type { DocumentsViewModel } from './documents.view-models';

/**
 * Presents the documents list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentsPresenter {
  constructor(private readonly placeholder: DocumentsViewModel) {}

  present(): DocumentsViewModel {
    return this.placeholder;
  }
}
