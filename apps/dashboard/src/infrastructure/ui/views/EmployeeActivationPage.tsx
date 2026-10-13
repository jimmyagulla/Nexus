import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { AccountComposition } from '../../composition/account.composition';
import { ActivationView } from '../features/account-activation/ActivationView';
import { EmployeeEnrollmentView } from '../features/employee-enrollment/EmployeeEnrollmentView';
import { EmployeeWorkspaceView } from '../features/employee-workspace/EmployeeWorkspaceView';
import { useActivateEmployeeAccount } from '../hooks/useActivateEmployeeAccount';
import { useConfirmSecondFactorEnrollment } from '../hooks/useConfirmSecondFactorEnrollment';

interface EmployeeActivationPageProps {
  invitationToken: string;
  deps: AccountComposition;
}

export function EmployeeActivationPage({
  invitationToken,
  deps,
}: EmployeeActivationPageProps) {
  const activation = useActivateEmployeeAccount(deps);
  const confirmation = useConfirmSecondFactorEnrollment(deps);

  if (confirmation.isSuccess) {
    return (
      <EmployeeWorkspaceView
        model={deps.workspacePresenter.present(confirmation.data)}
      />
    );
  }

  if (activation.isSuccess) {
    const { enrollmentId } = activation.data;
    return (
      <EmployeeEnrollmentView
        model={deps.enrollmentPresenter.present(activation.data)}
        errorPresenter={deps.errorPresenter}
        submissionError={refusalOf(deps.errorPresenter, confirmation)}
        onSubmit={async (code) => {
          await accepted(confirmation.mutateAsync({ enrollmentId, code }));
        }}
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
