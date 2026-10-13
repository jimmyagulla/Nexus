import { useEffect } from 'react';
import type { SecondFactorDestination } from '../../../adapters/presenters/second-factor-step.presenter';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { useGetSecondFactorChallenge } from '../hooks/useGetSecondFactorChallenge';
import { i18n } from '../i18n/i18n';

interface SecondFactorChallengePageProps {
  deps: SecondFactorComposition;
  onProceed: (destination: SecondFactorDestination) => void;
}

export function SecondFactorChallengePage({
  deps,
  onProceed,
}: SecondFactorChallengePageProps) {
  const challenge = useGetSecondFactorChallenge(deps);

  useEffect(() => {
    if (challenge.isSuccess) {
      onProceed(challenge.data);
    }
  }, [challenge.isSuccess, challenge.data, onProceed]);

  if (challenge.isError) {
    return <p>{deps.errorPresenter.present(challenge.error)}</p>;
  }

  return <p>{i18n.messages.loading}</p>;
}
