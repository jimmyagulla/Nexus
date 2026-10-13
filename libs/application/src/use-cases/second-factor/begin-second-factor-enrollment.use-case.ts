import {
  ActorContext,
  ErrorCode,
  requiresSecondFactor,
  SecondFactor,
  SecondFactorEnrollment,
  toOtpAuthUri,
} from '@hexagonal-monorepo-template/domain';
import {
  IBeginSecondFactorEnrollment,
  ISecondFactorCodes,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';

const ISSUER = 'Nexus';

export class BeginSecondFactorEnrollmentUseCase
  implements IBeginSecondFactorEnrollment
{
  constructor(
    private readonly factors: ISecondFactorRepository,
    private readonly codes: ISecondFactorCodes,
  ) {}

  async execute(input: {
    actor: ActorContext;
  }): Promise<SecondFactorEnrollment> {
    const companyId = this.requireEnrollingEmployee(input.actor);
    const factor = await this.pendingFactor(input.actor.userId, companyId);
    return {
      secret: factor.secret,
      provisioningUri: toOtpAuthUri({
        issuer: ISSUER,
        accountName: factor.userId,
        secret: factor.secret,
      }),
    };
  }

  private requireEnrollingEmployee(actor: ActorContext): string {
    if (!requiresSecondFactor(actor.role) || actor.companyId === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return actor.companyId;
  }

  private async pendingFactor(
    userId: string,
    companyId: string,
  ): Promise<SecondFactor> {
    const existing = await this.factors.findByUserId(userId);
    if (existing?.isEnrolled()) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    if (existing) {
      return existing;
    }
    const started = SecondFactor.begin(
      userId,
      companyId,
      this.codes.generateSecret(),
    );
    await this.factors.save(started);
    return started;
  }
}
