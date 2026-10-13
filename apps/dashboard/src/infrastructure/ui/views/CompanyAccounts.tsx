import type {
  CompanyAccountsViewModel,
  InvitationViewModel,
} from '../../../adapters/presenters/company-accounts.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../common/errors/SubmissionError';
import { AccountList } from '../features/company-accounts/AccountList';
import { InvitationNotice } from '../features/company-accounts/InvitationNotice';
import { InviteEmployerForm } from '../features/company-accounts/invite/InviteEmployerForm';
import { i18n } from '../i18n/i18n';

interface CompanyAccountsProps {
  model: CompanyAccountsViewModel;
  invitation: InvitationViewModel | null;
  errorPresenter: ErrorPresenter;
  busy: boolean;
  inviteError: string | null;
  actionError: string | null;
  onInvite: (identifier: string) => Promise<boolean>;
  onDisable: (accountId: string) => void;
  onRestore: (accountId: string) => void;
}

export function CompanyAccounts({
  model,
  invitation,
  errorPresenter,
  busy,
  inviteError,
  actionError,
  onInvite,
  onDisable,
  onRestore,
}: CompanyAccountsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{i18n.messages.accounts.title}</h1>

      <AccountList
        accounts={model.rows}
        busy={busy}
        onDisable={onDisable}
        onRestore={onRestore}
      />
      <SubmissionError message={actionError} />

      <InviteEmployerForm
        errorPresenter={errorPresenter}
        submissionError={inviteError}
        busy={busy}
        onSubmit={onInvite}
      />
      {invitation === null ? null : <InvitationNotice invitation={invitation} />}
    </div>
  );
}
