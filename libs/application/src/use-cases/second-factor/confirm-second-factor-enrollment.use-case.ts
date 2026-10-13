import {
  ActorContext,
  ErrorCode,
  SecondFactor,
  SecondFactorCode,
  SecondFactorEnrollmentConfirmation,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IConfirmSecondFactorEnrollment,
  ISecondFactorCodes,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';

export class ConfirmSecondFactorEnrollmentUseCase
  implements IConfirmSecondFactorEnrollment
{
  constructor(
    private readonly factors: ISecondFactorRepository,
    private readonly codes: ISecondFactorCodes,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    code: string;
  }): Promise<SecondFactorEnrollmentConfirmation> {
    const code = SecondFactorCode.parse(input.code);
    const pending = await this.requirePendingFactor(input.actor.userId);
    await this.requireValidCode(pending, code);
    await this.factors.save(pending.confirm());
    return { enrolled: true };
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
    if (!(await this.codes.matches(factor.secret, code.value, this.clock.now()))) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
  }
}
