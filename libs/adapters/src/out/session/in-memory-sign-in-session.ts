import { SignedInSession } from '@hexagonal-monorepo-template/domain';
import {
  ISignInSession,
  SignInSessionDraft,
} from '@hexagonal-monorepo-template/ports';

export class InMemorySignInSession implements ISignInSession {
  readonly opened: SignInSessionDraft[] = [];

  async open(draft: SignInSessionDraft): Promise<SignedInSession> {
    this.opened.push(draft);
    return {
      accessToken: `session:${draft.userId}`,
      companyId: draft.companyId,
      role: draft.role,
    };
  }
}
