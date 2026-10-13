import {
  IAccountGateway,
  IActivateEmployeeAccount,
} from '@hexagonal-monorepo-template/ports';

export class ActivateEmployeeAccountViaGatewayUseCase
  implements IActivateEmployeeAccount
{
  constructor(private readonly accounts: IAccountGateway) {}

  execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    return this.accounts.activateEmployee(input);
  }
}
