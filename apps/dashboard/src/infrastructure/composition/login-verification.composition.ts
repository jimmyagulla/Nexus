import { LoginVerificationPresenter } from '../../adapters/presenters/auth/login-verification.presenter';

export type LoginVerificationComposition = {
  presenter: LoginVerificationPresenter;
};

export function createLoginVerificationComposition(): LoginVerificationComposition {
  return { presenter: new LoginVerificationPresenter() };
}
