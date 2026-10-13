import type { LoginViewModel } from '../views/auth/Login';
import type { LoginVerificationViewModel } from '../views/auth/LoginVerification';

/** Placeholder data of the sign-in screens (mockup v3, flow 1). */
export const loginFixture: LoginViewModel = {
  organization: 'Atelier Moreau · Espace RH sécurisé',
  email: 'camille.martin@mail.fr',
  password: 'motdepasse',
};

export const loginVerificationFixture: LoginVerificationViewModel = {
  maskedEmail: 'c•••••••@mail.fr',
  code: '48291',
  resendIn: '0:42',
};
