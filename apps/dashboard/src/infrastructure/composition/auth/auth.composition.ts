import {
  createLoginPageComposition,
  type LoginPageComposition,
} from './login-page.composition';
import {
  createLoginVerificationPageComposition,
  type LoginVerificationPageComposition,
} from './login-verification-page.composition';

/** Compositions of the auth pages. */
export type AuthComposition = {
  login: LoginPageComposition;
  loginVerification: LoginVerificationPageComposition;
};

export function createAuthComposition(): AuthComposition {
  return {
    login: createLoginPageComposition(),
    loginVerification: createLoginVerificationPageComposition(),
  };
}
