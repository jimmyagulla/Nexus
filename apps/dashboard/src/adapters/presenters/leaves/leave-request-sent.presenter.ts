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
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LeaveRequestSentPresenter {
  present(leaveRequestSent: LeaveRequestSentViewModel): LeaveRequestSentViewModel {
    return leaveRequestSent;
  }
}
