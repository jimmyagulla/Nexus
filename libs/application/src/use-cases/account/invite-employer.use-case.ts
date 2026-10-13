import {
  Account,
  AccountIdentifier,
  ActorContext,
  ErrorCode,
  InvitedAccount,
  requireEmployerCompany,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IInviteEmployer,
} from '@hexagonal-monorepo-template/ports';

export class InviteEmployerUseCase implements IInviteEmployer {
  constructor(private readonly accounts: IAccountRepository) {}

  async execute(input: {
    actor: ActorContext;
    identifier: string;
  }): Promise<InvitedAccount> {
    const companyId = requireEmployerCompany(input.actor);
    const identifier = AccountIdentifier.parse(input.identifier);
    await this.refuseExistingIdentifier(identifier);
    const invitationToken = globalThis.crypto.randomUUID();
    const account = Account.inviteEmployer(
      globalThis.crypto.randomUUID(),
      companyId,
      identifier,
      invitationToken,
    );
    await this.accounts.insert(account);
    return this.toInvitedAccount(account, invitationToken);
  }

  private async refuseExistingIdentifier(
    identifier: AccountIdentifier,
  ): Promise<void> {
    if ((await this.accounts.findByIdentifier(identifier.value)) !== null) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }

  private toInvitedAccount(
    account: Account,
    invitationToken: string,
  ): InvitedAccount {
    return {
      id: account.id,
      identifier: account.identifier.value,
      role: account.role,
      status: account.status,
      invitationToken,
    };
  }
}
