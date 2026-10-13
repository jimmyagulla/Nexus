import { LoginPresenter } from '../../../adapters/presenters/auth/login.presenter';

export type LoginPageComposition = {
  presenter: LoginPresenter;
};

export function createLoginPageComposition(): LoginPageComposition {
  return { presenter: new LoginPresenter() };
}
