import type { AccountRowViewModel } from '../../../../adapters/presenters/company-accounts.presenter';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';

interface AccountCardProps {
  account: AccountRowViewModel;
  busy: boolean;
  onDisable: (accountId: string) => void;
  onRestore: (accountId: string) => void;
}

export function AccountCard({
  account,
  busy,
  onDisable,
  onRestore,
}: AccountCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span className="font-medium">{account.identifier}</span>
      <span>{account.roleLabel}</span>
      <span>{account.statusLabel}</span>
      {account.blockedMessage === null ? null : (
        <span className="text-sm text-destructive">
          {account.blockedMessage}
        </span>
      )}
      {account.canDisable ? (
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => onDisable(account.id)}
        >
          {i18n.messages.accounts.disable}
        </Button>
      ) : null}
      {account.canRestore ? (
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => onRestore(account.id)}
        >
          {i18n.messages.accounts.restore}
        </Button>
      ) : null}
    </li>
  );
}
