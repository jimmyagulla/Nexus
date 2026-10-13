import { useNavigate } from '@tanstack/react-router';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { AccountComposition } from '../../composition/account.composition';
import { SignInView } from '../features/sign-in/SignInView';
import { useSignIn } from '../hooks/useSignIn';
import { AppRoutes } from '../routes/app-routes';

interface SignInPageProps {
  deps: AccountComposition;
}

export function SignInPage({ deps }: SignInPageProps) {
  const navigate = useNavigate();
  const signIn = useSignIn(deps);

  return (
    <SignInView
      errorPresenter={deps.errorPresenter}
      submissionError={refusalOf(deps.errorPresenter, signIn)}
      onSubmit={async (identifier, secret) => {
        const accepted = await signIn
          .mutateAsync({ identifier, secret })
          .then(
            () => true,
            () => false,
          );
        if (accepted) {
          await navigate({ to: AppRoutes.home });
        }
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
