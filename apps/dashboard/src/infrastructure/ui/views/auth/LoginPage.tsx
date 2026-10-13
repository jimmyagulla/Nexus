import { loginFixture } from '../../fixtures/auth.fixture';
import { Login } from './Login';

/** Placeholder data until the authentication presenter is wired. */
export function LoginPage() {
  return <Login model={loginFixture} />;
}
