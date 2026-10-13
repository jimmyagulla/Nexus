import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { AccountComposition } from '../../composition/account.composition';
import { ActivationView } from '../features/account-activation/ActivationView';
import { EmployeeEnrollmentView } from '../features/employee-enrollment/EmployeeEnrollmentView';
import { useActivateEmployeeAccount } from '../hooks/useActivateEmployeeAccount';

interface EmployeeActivationPageProps {
  invitationToken: string;
  deps: AccountComposition;
}

export function EmployeeActivationPage({
  invitationToken,
  deps,
}: EmployeeActivationPageProps) {
  const activation = useActivateEmployeeAccount(deps);

  if (activation.isSuccess) {
    return (
      <EmployeeEnrollmentView
        model={deps.enrollmentPresenter.present(activation.data)}
      />
    );
  }

  return (
    <ActivationView
      opened={false}
      errorPresenter={deps.errorPresenter}
      submissionError={refusalOf(deps.errorPresenter, activation)}
      onSubmit={async (secret) => {
        await accepted(activation.mutateAsync({ invitationToken, secret }));
      }}
    />
  );
}

function refusalOf(
  presenter: ErrorPresenter,
  mutation: { isError: boolean; error: unknown },
): string | null {
  return mutation.isError ? presenter.present(mutation.error) : null;
}

function accepted(mutation: Promise<unknown>): Promise<boolean> {
  return mutation.then(
    () => true,
    () => false,
  );
}
