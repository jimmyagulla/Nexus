import { loginVerificationFixture } from '../../fixtures/auth.fixture';
import { LoginVerification } from './LoginVerification';

/** Placeholder data until the authentication presenter is wired. */
export function LoginVerificationPage() {
  return <LoginVerification model={loginVerificationFixture} />;
}
