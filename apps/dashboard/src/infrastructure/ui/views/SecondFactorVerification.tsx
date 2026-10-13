import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorCodeForm } from '../features/second-factor/SecondFactorCodeForm';
import { secondFactorProofSchema } from '../features/second-factor/second-factor-proof.schema';
import { i18n } from '../i18n/i18n';

interface SecondFactorVerificationProps {
  errorPresenter: ErrorPresenter;
  verified: boolean;
  submissionError: string | null;
  pending: boolean;
  onVerify: (code: string) => Promise<void>;
}

export function SecondFactorVerification({
  errorPresenter,
  verified,
  submissionError,
  pending,
  onVerify,
}: SecondFactorVerificationProps) {
  const labels = i18n.messages.secondFactorVerification;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      {verified ? (
        <p>{labels.done}</p>
      ) : (
        <>
          <p>{labels.instructions}</p>
          <SecondFactorCodeForm
            label={labels.code}
            submitLabel={labels.confirm}
            schema={secondFactorProofSchema}
            errorPresenter={errorPresenter}
            submissionError={submissionError}
            pending={pending}
            onSubmit={onVerify}
          />
        </>
      )}
    </div>
  );
}
