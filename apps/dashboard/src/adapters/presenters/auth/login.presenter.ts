export interface LoginViewModel {
  organization: string;
  email: string;
  password: string;
}

/**
 * Presents the login screen.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LoginPresenter {
  present(login: LoginViewModel): LoginViewModel {
    return login;
  }
}
