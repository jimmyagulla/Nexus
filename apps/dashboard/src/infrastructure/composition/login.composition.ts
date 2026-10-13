import { LoginPresenter } from '../../adapters/presenters/auth/login.presenter';

export type LoginComposition = {
  presenter: LoginPresenter;
};

export function createLoginComposition(): LoginComposition {
  return { presenter: new LoginPresenter() };
}
