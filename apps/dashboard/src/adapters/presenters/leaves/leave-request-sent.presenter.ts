import type { ProgressStepViewModel, StatusViewModel } from '../display.types';

export interface LeaveRequestSentViewModel {
  description: string;
  type: string;
  period: string;
  deducted: string;
  sentAt: string;
  status: StatusViewModel;
  steps: ProgressStepViewModel[];
}

/**
 * Presents the leave request confirmation.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LeaveRequestSentPresenter {
  constructor(private readonly placeholder: LeaveRequestSentViewModel) {}

  present(): LeaveRequestSentViewModel {
    return this.placeholder;
  }
}
