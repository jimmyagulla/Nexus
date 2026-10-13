import type { LoginVerificationComposition } from '../../../composition/login-verification.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLoginVerification } from '../../hooks/useGetLoginVerification';
import { i18n } from '../../i18n/i18n';
import { LoginVerification } from './LoginVerification';

interface LoginVerificationPageProps {
  deps: LoginVerificationComposition;
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
