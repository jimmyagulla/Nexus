import type { LeaveRequestViewModel } from './leaves.view-models';

/**
 * Presents the leave request form.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LeaveRequestPresenter {
  constructor(private readonly placeholder: LeaveRequestViewModel) {}

  present(): LeaveRequestViewModel {
    return this.placeholder;
  }
}
