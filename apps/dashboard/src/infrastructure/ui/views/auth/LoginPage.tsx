import type { AuthComposition } from '../../../composition/auth.composition';
import { Login } from './Login';

interface LoginPageProps {
  deps: AuthComposition;
}

export function LoginPage({ deps }: LoginPageProps) {
  return <Login model={deps.loginPresenter.present()} />;
}
