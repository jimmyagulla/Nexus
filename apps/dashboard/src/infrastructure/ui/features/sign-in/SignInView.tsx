import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { SignInForm } from './SignInForm';

interface SignInViewProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (identifier: string, secret: string) => Promise<void>;
}

export function SignInView({
  errorPresenter,
  submissionError,
  onSubmit,
}: SignInViewProps) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">
        {i18n.messages.signIn.title}
      </h1>
      <SignInForm
        errorPresenter={errorPresenter}
        submissionError={submissionError}
        onSubmit={onSubmit}
      />
    </section>
  );
}
