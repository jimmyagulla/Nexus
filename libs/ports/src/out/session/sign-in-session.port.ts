import { SignedInSession, UserRole } from '@hexagonal-monorepo-template/domain';

export type SignInSessionDraft = {
  userId: string;
  companyId: string;
  role: UserRole;
};

export interface ISignInSession {
  open(draft: SignInSessionDraft): Promise<SignedInSession>;
}

export const ISignInSession = Symbol('ISignInSession');
