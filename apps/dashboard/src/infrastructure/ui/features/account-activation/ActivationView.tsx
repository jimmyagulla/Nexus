import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { ActivationForm } from './ActivationForm';

interface ActivationViewProps {
  opened: boolean;
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (secret: string) => Promise<void>;
}

export function ActivationView({
  opened,
  errorPresenter,
  submissionError,
  onSubmit,
}: ActivationViewProps) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">
        {i18n.messages.activation.title}
      </h1>
      {opened ? (
        <p>{i18n.messages.activation.opened}</p>
      ) : (
        <ActivationForm
          errorPresenter={errorPresenter}
          submissionError={submissionError}
          onSubmit={onSubmit}
        />
      )}
    </section>
  );
}
