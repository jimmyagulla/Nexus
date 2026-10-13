import type { SecondFactorEnrollmentViewModel } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { RecoveryCodeList } from '../features/second-factor/RecoveryCodeList';
import { SecondFactorCodeForm } from '../features/second-factor/SecondFactorCodeForm';
import { secondFactorCodeSchema } from '../features/second-factor/second-factor-code.schema';
import { i18n } from '../i18n/i18n';

interface SecondFactorEnrollmentProps {
  model: SecondFactorEnrollmentViewModel;
  errorPresenter: ErrorPresenter;
  recoveryCodes: string[] | null;
  submissionError: string | null;
  pending: boolean;
  onConfirm: (code: string) => Promise<void>;
}

export function SecondFactorEnrollment({
  model,
  errorPresenter,
  recoveryCodes,
  submissionError,
  pending,
  onConfirm,
}: SecondFactorEnrollmentProps) {
  const labels = i18n.messages.secondFactor.enrollment;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      {recoveryCodes !== null ? (
        <>
          <p>{labels.done}</p>
          <h2 className="text-xl font-semibold">{labels.recoveryTitle}</h2>
          <p>{labels.recoveryNotice}</p>
          <RecoveryCodeList codes={recoveryCodes} />
        </>
      ) : (
        <>
          <p>{labels.instructions}</p>
          <p>
            <span className="text-sm font-medium">{labels.secret}</span>{' '}
            <code>{model.secret}</code>
          </p>
          <SecondFactorCodeForm
            label={labels.code}
            submitLabel={labels.confirm}
            schema={secondFactorCodeSchema}
            errorPresenter={errorPresenter}
            submissionError={submissionError}
            pending={pending}
            onSubmit={onConfirm}
          />
        </>
      )}
    </div>
  );
}
