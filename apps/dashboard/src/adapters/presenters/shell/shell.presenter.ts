import type { ShellViewModel } from './shell.view-models';

/**
 * Presents the app shell (navigation, user, search) of one role.
 * Until the session and counters use cases exist, the composition root hands
 * it placeholder data, which it returns as is.
 */
export class ShellPresenter {
  constructor(private readonly placeholder: ShellViewModel) {}

  present(): ShellViewModel {
    return this.placeholder;
  }
}
