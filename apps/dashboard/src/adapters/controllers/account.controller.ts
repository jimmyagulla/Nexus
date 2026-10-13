import {
  SecondFactorEnrollmentOffer,
  SignedInSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IActivateAccount,
  IActivateEmployeeAccount,
  ISignIn,
} from '@hexagonal-monorepo-template/ports';

export class AccountController {
  constructor(
    private readonly activateAccount: IActivateAccount,
    private readonly activateEmployeeAccount: IActivateEmployeeAccount,
    private readonly signInAccount: ISignIn,
  ) {}

  activate(invitationToken: string, secret: string): Promise<void> {
    return this.activateAccount.execute({ invitationToken, secret });
  }

  activateEmployee(
    invitationToken: string,
    secret: string,
  ): Promise<SecondFactorEnrollmentOffer> {
    return this.activateEmployeeAccount.execute({ invitationToken, secret });
  }

  signIn(identifier: string, secret: string): Promise<SignedInSession> {
    return this.signInAccount.execute({ identifier, secret });
  }
}
