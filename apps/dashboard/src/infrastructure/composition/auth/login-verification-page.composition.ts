import { LoginVerificationPresenter } from '../../../adapters/presenters/auth/login-verification.presenter';

export type LoginVerificationPageComposition = {
  presenter: LoginVerificationPresenter;
};

export function createLoginVerificationPageComposition(): LoginVerificationPageComposition {
  return { presenter: new LoginVerificationPresenter() };
}
