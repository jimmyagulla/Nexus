import type { LoginVerificationPageComposition } from '../../../composition/auth/login-verification-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLoginVerification } from '../../hooks/auth/useGetLoginVerification';
import { i18n } from '../../i18n/i18n';
import { LoginVerification } from './LoginVerification';

interface LoginVerificationPageProps {
  deps: LoginVerificationPageComposition;
}

export function LoginVerificationPage({ deps }: LoginVerificationPageProps) {
  const loginVerification = useGetLoginVerification(deps);

  if (loginVerification.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (loginVerification.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <LoginVerification model={loginVerification.data} />;
}
