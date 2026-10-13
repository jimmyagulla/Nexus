import {
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
    const account = await this.accounts.findByIdentifier(identifier.value);
    if (
      account === null ||
      account.status !== AccountStatus.ACTIVE ||
      account.secretHash === null
    ) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    if (!(await this.secrets.matches(secret.value, account.secretHash))) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return this.sessions.open({
      userId: account.identifier.value,
      companyId: account.companyId,
      role: account.role,
    });
  }
}
