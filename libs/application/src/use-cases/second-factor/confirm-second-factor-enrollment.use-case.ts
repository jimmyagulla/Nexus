import {
  ActorContext,
  ErrorCode,
  RECOVERY_CODE_COUNT,
  SecondFactor,
  SecondFactorCode,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IConfirmSecondFactorEnrollment,
  IRecoveryCodes,
  ISecondFactorCodes,
  ISecondFactorIdentityBinder,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';

export class ConfirmSecondFactorEnrollmentUseCase
  implements IConfirmSecondFactorEnrollment
{
  constructor(
    private readonly factors: ISecondFactorRepository,
    private readonly codes: ISecondFactorCodes,
    private readonly recovery: IRecoveryCodes,
    private readonly identity: ISecondFactorIdentityBinder,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    code: string;
  }): Promise<SecondFactorEnrollmentConfirmation> {
    const code = SecondFactorCode.parse(input.code);
    const pending = await this.requirePendingFactor(input.actor.userId);
    await this.requireValidCode(pending, code);
    const recoveryCodes = this.recovery.generate(RECOVERY_CODE_COUNT);
    await this.factors.save(
      pending.confirm(await this.digestAll(recoveryCodes)),
    );
    await this.identity.markVerified(input.actor.userId);
    return { enrolled: true, recoveryCodes };
  }

  private async requirePendingFactor(userId: string): Promise<SecondFactor> {
    const factor = await this.factors.findByUserId(userId);
    if (factor === null || factor.isEnrolled()) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return factor;
  }

  private async requireValidCode(
    factor: SecondFactor,
    code: SecondFactorCode,
  ): Promise<void> {
    if (
      !(await this.codes.matches(factor.secret, code.value, this.clock.now()))
    ) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
  }

  private digestAll(recoveryCodes: readonly string[]): Promise<string[]> {
    return Promise.all(recoveryCodes.map((code) => this.recovery.digest(code)));
  }
}
