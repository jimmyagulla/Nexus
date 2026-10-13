import {
  ActorContext,
  nextSecondFactorStep,
  SecondFactorStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  IGetSecondFactorStatus,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';

export class GetSecondFactorStatusUseCase implements IGetSecondFactorStatus {
  constructor(private readonly factors: ISecondFactorRepository) {}

  async execute(input: { actor: ActorContext }): Promise<SecondFactorStatus> {
    const { actor } = input;
    const factor = await this.factors.findByUserId(actor.userId);
    return {
      step: nextSecondFactorStep({
        role: actor.role,
        enrolled: factor?.isEnrolled() === true,
        verified: actor.secondFactorVerified === true,
      }),
    };
  }
}
