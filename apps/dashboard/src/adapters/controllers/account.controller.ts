import { IActivateAccount } from '@hexagonal-monorepo-template/ports';

export class AccountController {
  constructor(private readonly activateAccount: IActivateAccount) {}

  activate(invitationToken: string, secret: string): Promise<void> {
    return this.activateAccount.execute({ invitationToken, secret });
  }
}
