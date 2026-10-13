import type { ProgressStepViewModel, StatusViewModel } from '../display.types';

export interface DocumentSentViewModel {
  description: string;
  type: string;
  fileName: string;
  sentAt: string;
  recipient: string;
  status: StatusViewModel;
  steps: ProgressStepViewModel[];
}

/**
 * Presents the document sent confirmation.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class DocumentSentPresenter {
  present(documentSent: DocumentSentViewModel): DocumentSentViewModel {
    return documentSent;
  }
}
