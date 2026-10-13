import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { AccountComposition } from '../../composition/account.composition';
import { useActivateAccount } from '../hooks/useActivateAccount';
import { ActivationView } from '../features/account-activation/ActivationView';

interface ActivationPageProps {
  invitationToken: string;
  deps: AccountComposition;
}

export function ActivationPage({ invitationToken, deps }: ActivationPageProps) {
  const activation = useActivateAccount(deps);

  return (
    <ActivationView
      opened={activation.isSuccess}
      errorPresenter={deps.errorPresenter}
      submissionError={refusalOf(deps.errorPresenter, activation)}
      onSubmit={async (secret) => {
        await accepted(
          activation.mutateAsync({ invitationToken, secret }),
        );
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
