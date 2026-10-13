import {
  Account,
  AccountIdentifier,
  AccountSecret,
  AccountStatus,
  ErrorCode,
  SignedInSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  ISecretHasher,
  ISignIn,
  ISignInSession,
} from '@hexagonal-monorepo-template/ports';

export class SignInUseCase implements ISignIn {
  constructor(
    private readonly accounts: IAccountRepository,
    private readonly secrets: ISecretHasher,
    private readonly sessions: ISignInSession,
  ) {}

  async execute(input: {
    identifier: string;
    secret: string;
  }): Promise<SignedInSession> {
    const identifier = AccountIdentifier.parse(input.identifier);
    const secret = AccountSecret.parse(input.secret);
    const account = await this.requireActiveAccount(identifier.value);
    this.refuseIfLocked(account);
    await this.authenticate(account, secret.value);
    await this.resetFailedSignIns(account);
    return this.sessions.open({
      userId: account.identifier.value,
      companyId: account.companyId,
      role: account.role,
    });
  }

  private async requireActiveAccount(identifier: string): Promise<Account> {
    const account = await this.accounts.findByIdentifier(identifier);
    if (
      account === null ||
      account.status !== AccountStatus.ACTIVE ||
      account.secretHash === null
    ) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return account;
  }

  private refuseIfLocked(account: Account): void {
    if (account.isLocked()) {
      throw new Error(ErrorCode.ACCOUNT_LOCKED);
    }
  }

  private async authenticate(account: Account, secret: string): Promise<void> {
    const secretHash = account.secretHash;
    if (secretHash === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    if (await this.secrets.matches(secret, secretHash)) {
      return;
    }
    const failed = account.recordFailedSignIn();
    await this.accounts.save(failed);
    throw new Error(
      failed.isLocked() ? ErrorCode.ACCOUNT_LOCKED : ErrorCode.ACCESS_DENIED,
    );
  }

  private resetFailedSignIns(account: Account): Promise<void> {
    return this.accounts.save(account.clearFailedSignIns());
  }
}
