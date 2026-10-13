import {
  ActorContext,
  nextSecondFactorStep,
  requiresSecondFactor,
  SecondFactorChallenge,
} from '@hexagonal-monorepo-template/domain';
import {
  IOpenSecondFactorChallenge,
  ISecondFactorIdentityBinder,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';

export class OpenSecondFactorChallengeUseCase
  implements IOpenSecondFactorChallenge
{
  constructor(
    private readonly factors: ISecondFactorRepository,
    private readonly identity: ISecondFactorIdentityBinder,
  ) {}

  async execute(input: {
    actor: ActorContext;
  }): Promise<SecondFactorChallenge> {
    const { actor } = input;
    if (!requiresSecondFactor(actor.role)) {
      return { step: nextSecondFactorStep(this.stateOf(actor, false)) };
    }
    await this.identity.clearVerified(actor.userId);
    return { step: nextSecondFactorStep(await this.currentState(actor)) };
  }

  private async currentState(actor: ActorContext) {
    const factor = await this.factors.findByUserId(actor.userId);
    return this.stateOf(actor, factor?.isEnrolled() === true);
  }

  private stateOf(actor: ActorContext, enrolled: boolean) {
    return { role: actor.role, enrolled, verified: false };
  }
}
