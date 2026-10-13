import { LoginPresenter } from '../../adapters/presenters/auth/login.presenter';
import { LoginVerificationPresenter } from '../../adapters/presenters/auth/login-verification.presenter';
import { loginFixture, loginVerificationFixture } from '../ui/fixtures/auth.fixture';

export type AuthComposition = {
  loginPresenter: LoginPresenter;
  loginVerificationPresenter: LoginVerificationPresenter;
};

/** Presenters of the auth screens, fed with placeholder data for now. */
export function createAuthComposition(): AuthComposition {
  return {
    loginPresenter: new LoginPresenter(loginFixture),
    loginVerificationPresenter: new LoginVerificationPresenter(loginVerificationFixture),
  };
}
