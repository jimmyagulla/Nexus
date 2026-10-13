import {
  ActorContext,
  ErrorCode,
  SecondFactor,
  SecondFactorProof,
  SecondFactorVerification,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IRecoveryCodes,
  ISecondFactorCodes,
  ISecondFactorIdentityBinder,
  ISecondFactorRepository,
  IVerifySecondFactor,
} from '@hexagonal-monorepo-template/ports';

export class VerifySecondFactorUseCase implements IVerifySecondFactor {
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
  }): Promise<SecondFactorVerification> {
    const proof = SecondFactorProof.parse(input.code);
    const factor = await this.requireEnrolledFactor(input.actor.userId);
    await this.accept(factor, proof);
    await this.identity.markVerified(input.actor.userId);
    return { verified: true };
  }

  private async requireEnrolledFactor(userId: string): Promise<SecondFactor> {
    const factor = await this.factors.findByUserId(userId);
    if (factor === null || !factor.isEnrolled()) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
    return factor;
  }

  private async accept(
    factor: SecondFactor,
    proof: SecondFactorProof,
  ): Promise<void> {
    if (proof.kind === 'RECOVERY_CODE') {
      await this.spendRecoveryCode(factor, proof.value);
      return;
    }
    if (
      !(await this.codes.matches(factor.secret, proof.value, this.clock.now()))
    ) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
  }

  private async spendRecoveryCode(
    factor: SecondFactor,
    code: string,
  ): Promise<void> {
    const spent = factor.consumeRecoveryCode(await this.recovery.digest(code));
    await this.factors.save(spent);
  }
}
