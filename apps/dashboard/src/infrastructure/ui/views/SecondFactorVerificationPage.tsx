import { useEffect } from 'react';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { useVerifySecondFactor } from '../hooks/useVerifySecondFactor';
import { SecondFactorVerification } from './SecondFactorVerification';

interface SecondFactorVerificationPageProps {
  deps: SecondFactorComposition;
  onVerified: () => void;
}

export function SecondFactorVerificationPage({
  deps,
  onVerified,
}: SecondFactorVerificationPageProps) {
  const verify = useVerifySecondFactor(deps);

  useEffect(() => {
    if (verify.isSuccess) {
      onVerified();
    }
  }, [verify.isSuccess, onVerified]);

  return (
    <SecondFactorVerification
      errorPresenter={deps.errorPresenter}
      verified={verify.isSuccess}
      submissionError={
        verify.isError ? deps.errorPresenter.present(verify.error) : null
      }
      pending={verify.isPending}
      onVerify={async (code) => {
        await verify.mutateAsync(code).catch(() => undefined);
      }}
    />
  );
}
