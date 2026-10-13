import {
  IAccountGateway,
  IActivateAccount,
} from '@hexagonal-monorepo-template/ports';

export class ActivateAccountViaGatewayUseCase implements IActivateAccount {
  constructor(private readonly accounts: IAccountGateway) {}

  execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    return this.accounts.activate(input);
  }
}
