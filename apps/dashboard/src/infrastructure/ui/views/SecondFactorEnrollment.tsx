import type { SecondFactorEnrollmentViewModel } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorCodeForm } from '../features/second-factor/SecondFactorCodeForm';
import { i18n } from '../i18n/i18n';

interface SecondFactorEnrollmentProps {
  model: SecondFactorEnrollmentViewModel;
  errorPresenter: ErrorPresenter;
  confirmed: boolean;
  submissionError: string | null;
  pending: boolean;
  onConfirm: (code: string) => Promise<void>;
}

export function SecondFactorEnrollment({
  model,
  errorPresenter,
  confirmed,
  submissionError,
  pending,
  onConfirm,
}: SecondFactorEnrollmentProps) {
  const labels = i18n.messages.secondFactor.enrollment;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      {confirmed ? (
        <p>{labels.done}</p>
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
