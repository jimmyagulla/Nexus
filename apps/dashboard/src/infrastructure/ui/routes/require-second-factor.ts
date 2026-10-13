import { redirect } from '@tanstack/react-router';
import type { SecondFactorComposition } from '../../composition/second-factor.composition';
import { SECOND_FACTOR_DESTINATIONS } from './second-factor-destinations';

type SecondFactorGate = Pick<
  SecondFactorComposition,
  'controller' | 'stepPresenter'
>;

export async function requireSecondFactor(
  gate: SecondFactorGate,
): Promise<void> {
  const destination = await destinationOf(gate);
  if (destination === null || destination === 'SPACE') {
    return;
  }

  throw redirect({ to: SECOND_FACTOR_DESTINATIONS[destination] });
}

async function destinationOf(gate: SecondFactorGate) {
  try {
    return gate.stepPresenter.present(await gate.controller.getStatus());
  } catch {
    // The api stays the authority: it refuses personal data on its own.
    return null;
  }
}
