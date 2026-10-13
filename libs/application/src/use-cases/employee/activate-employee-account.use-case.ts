import {
  Account,
  AccountSecret,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IActivateEmployeeAccount,
  ISecretHasher,
} from '@hexagonal-monorepo-template/ports';

export class ActivateEmployeeAccountUseCase implements IActivateEmployeeAccount {
  constructor(
    private readonly accounts: IAccountRepository,
    private readonly secrets: ISecretHasher,
  ) {}

  async execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    const secret = AccountSecret.parse(input.secret);
    const account = await this.requireEmployeeInvitation(
      input.invitationToken,
    );
    await this.accounts.save(
      account.activate(await this.secrets.hash(secret.value)),
    );
  }

  private async requireEmployeeInvitation(
    invitationToken: string,
  ): Promise<Account> {
    const account = await this.accounts.findByInvitationToken(
      invitationToken.trim(),
    );
    if (account === null || account.role !== UserRole.EMPLOYEE) {
      throw new Error(ErrorCode.INVITATION_INVALID);
    }
    return account;
  }
}
