import type { LeavesViewModel } from './leaves.view-models';

/**
 * Presents the leaves overview.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LeavesPresenter {
  constructor(private readonly placeholder: LeavesViewModel) {}

  present(): LeavesViewModel {
    return this.placeholder;
  }
}
