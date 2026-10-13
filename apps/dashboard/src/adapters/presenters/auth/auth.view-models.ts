/** View models of the auth screens, produced by their presenters. */

export interface LoginViewModel {
  organization: string;
  email: string;
  password: string;
}

export interface LoginVerificationViewModel {
  maskedEmail: string;
  code: string;
  resendIn: string;
}
