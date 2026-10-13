export interface LoginVerificationViewModel {
  maskedEmail: string;
  code: string;
  resendIn: string;
}

/**
 * Presents the two-step verification screen.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class LoginVerificationPresenter {
  present(loginVerification: LoginVerificationViewModel): LoginVerificationViewModel {
    return loginVerification;
  }
}
