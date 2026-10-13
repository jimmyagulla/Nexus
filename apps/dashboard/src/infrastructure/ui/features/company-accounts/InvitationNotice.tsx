import type { InvitationViewModel } from '../../../../adapters/presenters/company-accounts.presenter';
import { i18n } from '../../i18n/i18n';

interface InvitationNoticeProps {
  invitation: InvitationViewModel;
}

export function InvitationNotice({ invitation }: InvitationNoticeProps) {
  return (
    <p role="status" className="text-sm">
      {invitation.identifier} — {i18n.messages.accounts.activationLink} :{' '}
      <code>{invitation.activationPath}</code>
    </p>
  );
}
