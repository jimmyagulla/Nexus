import {
  AccountSecret,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IActivateAccount,
  ISecretHasher,
} from '@hexagonal-monorepo-template/ports';

export class ActivateAccountUseCase implements IActivateAccount {
  constructor(
    private readonly accounts: IAccountRepository,
    private readonly secrets: ISecretHasher,
  ) {}

  async execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<void> {
    const secret = AccountSecret.parse(input.secret);
    const account = await this.accounts.findByInvitationToken(
      input.invitationToken.trim(),
    );
    if (account === null) {
      throw new Error(ErrorCode.INVITATION_INVALID);
    }
    await this.accounts.save(
      account.activate(await this.secrets.hash(secret.value)),
    );
  }
}
