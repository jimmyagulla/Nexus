import type { LeaveRequestSentViewModel } from './leaves.view-models';

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
