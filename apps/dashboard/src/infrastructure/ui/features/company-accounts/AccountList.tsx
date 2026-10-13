import type { AccountRowViewModel } from '../../../../adapters/presenters/company-accounts.presenter';
import { AccountCard } from './AccountCard';

interface AccountListProps {
  accounts: AccountRowViewModel[];
  busy: boolean;
  onDisable: (accountId: string) => void;
  onRestore: (accountId: string) => void;
}

export function AccountList({
  accounts,
  busy,
  onDisable,
  onRestore,
}: AccountListProps) {
  return (
    <ul>
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          busy={busy}
          onDisable={onDisable}
          onRestore={onRestore}
        />
      ))}
    </ul>
  );
}
