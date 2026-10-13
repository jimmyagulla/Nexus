import type { AuthComposition } from '../../../composition/auth.composition';
import { LoginVerification } from './LoginVerification';

interface LoginVerificationPageProps {
  deps: AuthComposition;
}

export function LoginVerificationPage({ deps }: LoginVerificationPageProps) {
  return <LoginVerification model={deps.loginVerificationPresenter.present()} />;
}
