export interface LoginViewModel {
  organization: string;
  email: string;
  password: string;
}

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
