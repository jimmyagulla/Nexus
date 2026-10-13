import type { EmployeeEnrollmentViewModel } from '../../../../adapters/presenters/employee-enrollment.presenter';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { EnrollmentCodeForm } from './EnrollmentCodeForm';

interface EmployeeEnrollmentViewProps {
  model: EmployeeEnrollmentViewModel;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (code: string) => Promise<void>;
}

export function EmployeeEnrollmentView({
  model,
  errorPresenter,
  submissionError,
  onSubmit,
}: EmployeeEnrollmentViewProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">
        {i18n.messages.enrollment.title}
      </h1>
      <p>{i18n.messages.enrollment.instruction}</p>
      <div className="space-y-1">
        <p className="text-sm font-medium">{i18n.messages.enrollment.secret}</p>
        <p className="font-mono text-lg tracking-wide">{model.secretDisplay}</p>
      </div>
      <a className="text-primary underline" href={model.provisioningUri}>
        {i18n.messages.enrollment.uri}
      </a>
      <EnrollmentCodeForm
        errorPresenter={errorPresenter}
        submissionError={submissionError}
        onSubmit={onSubmit}
      />
    </section>
  );
}
