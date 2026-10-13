import type { LoginComposition } from '../../../composition/login.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLogin } from '../../hooks/useGetLogin';
import { i18n } from '../../i18n/i18n';
import { Login } from './Login';

interface LoginPageProps {
  deps: LoginComposition;
}

export function LoginPage({ deps }: LoginPageProps) {
  const login = useGetLogin(deps);

  if (login.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (login.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Login model={login.data} />;
}
