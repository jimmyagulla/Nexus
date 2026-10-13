import { SignedInSession } from '@hexagonal-monorepo-template/domain';
import { IActivateAccount, ISignIn } from '@hexagonal-monorepo-template/ports';

export class AccountController {
  constructor(
    private readonly activateAccount: IActivateAccount,
    private readonly signInAccount: ISignIn,
  ) {}

  activate(invitationToken: string, secret: string): Promise<void> {
    return this.activateAccount.execute({ invitationToken, secret });
  }

  signIn(identifier: string, secret: string): Promise<SignedInSession> {
    return this.signInAccount.execute({ identifier, secret });
  }
}
