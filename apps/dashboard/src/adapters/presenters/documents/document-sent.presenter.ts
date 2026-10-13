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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentSentPresenter {
  constructor(private readonly placeholder: DocumentSentViewModel) {}

  present(): DocumentSentViewModel {
    return this.placeholder;
  }
}
