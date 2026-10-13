import {
  Account,
  AccountSecret,
  ErrorCode,
  SecondFactorEnrollment,
  SecondFactorEnrollmentOffer,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  IActivateEmployeeAccount,
  IIdGenerator,
  ISecondFactorCodes,
  ISecondFactorEnrollmentRepository,
  ISecretHasher,
} from '@hexagonal-monorepo-template/ports';

export class ActivateEmployeeAccountUseCase implements IActivateEmployeeAccount {
  constructor(
    private readonly accounts: IAccountRepository,
    private readonly secrets: ISecretHasher,
    private readonly enrollments: ISecondFactorEnrollmentRepository,
    private readonly codes: ISecondFactorCodes,
    private readonly ids: IIdGenerator,
  ) {}

  async execute(input: {
    invitationToken: string;
    secret: string;
  }): Promise<SecondFactorEnrollmentOffer> {
    const secret = AccountSecret.parse(input.secret);
    const account = await this.requireEmployeeInvitation(
      input.invitationToken,
    );
    const active = await this.activate(account, secret);
    return this.offerEnrollment(active);
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

  private async activate(
    account: Account,
    secret: AccountSecret,
  ): Promise<Account> {
    const active = account.activate(await this.secrets.hash(secret.value));
    await this.accounts.save(active);
    return active;
  }

  private async offerEnrollment(
    account: Account,
  ): Promise<SecondFactorEnrollmentOffer> {
    const enrollment = SecondFactorEnrollment.start(
      this.ids.generate(),
      account.id,
      this.codes.issueSecret(),
    );
    await this.enrollments.insert(enrollment);
    return {
      enrollmentId: enrollment.id,
      secret: enrollment.secret,
      provisioningUri: this.codes.provisioningUri(
        account.identifier.value,
        enrollment.secret,
      ),
    };
  }
}
