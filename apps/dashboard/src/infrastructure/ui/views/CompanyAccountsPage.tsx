import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CompanyAccountsComposition } from '../../composition/company-accounts.composition';
import { useDisableAccount } from '../hooks/useDisableAccount';
import { useGetCompanyAccounts } from '../hooks/useGetCompanyAccounts';
import { useInviteEmployer } from '../hooks/useInviteEmployer';
import { useRestoreAccount } from '../hooks/useRestoreAccount';
import { i18n } from '../i18n/i18n';
import { CompanyAccounts } from './CompanyAccounts';

interface CompanyAccountsPageProps {
  deps: CompanyAccountsComposition;
}

export function CompanyAccountsPage({ deps }: CompanyAccountsPageProps) {
  const accounts = useGetCompanyAccounts(deps);
  const invite = useInviteEmployer(deps);
  const disable = useDisableAccount(deps);
  const restore = useRestoreAccount(deps);

  if (accounts.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (accounts.isError) {
    return <p>{deps.errorPresenter.present(accounts.error)}</p>;
  }

  return (
    <CompanyAccounts
      model={accounts.data}
      invitation={
        invite.data === undefined
          ? null
          : deps.presenter.presentInvitation(invite.data)
      }
      errorPresenter={deps.errorPresenter}
      busy={invite.isPending || disable.isPending || restore.isPending}
      inviteError={refusalOf(deps.errorPresenter, invite)}
      actionError={
        refusalOf(deps.errorPresenter, disable) ??
        refusalOf(deps.errorPresenter, restore)
      }
      onInvite={(identifier) => accepted(invite.mutateAsync(identifier))}
      onDisable={(accountId) => {
        restore.reset();
        disable.mutate(accountId);
      }}
      onRestore={(accountId) => {
        disable.reset();
        restore.mutate(accountId);
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
