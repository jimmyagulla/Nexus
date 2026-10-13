export interface LoginVerificationViewModel {
  maskedEmail: string;
  code: string;
  resendIn: string;
}

/**
 * Presents the two-step verification screen.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class LoginVerificationPresenter {
  constructor(private readonly placeholder: LoginVerificationViewModel) {}

  present(): LoginVerificationViewModel {
    return this.placeholder;
  }
}
