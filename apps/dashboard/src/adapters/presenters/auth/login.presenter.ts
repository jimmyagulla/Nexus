import type { LoginViewModel } from './auth.view-models';

/**
 * Presents the login screen.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LoginPresenter {
  constructor(private readonly placeholder: LoginViewModel) {}

  present(): LoginViewModel {
    return this.placeholder;
  }
}
