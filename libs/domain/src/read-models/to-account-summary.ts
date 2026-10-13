import { Account } from '../entities/account';
import { AccountSummary } from './account-summary';

export function toAccountSummary(account: Account): AccountSummary {
  return {
    id: account.id,
    identifier: account.identifier.value,
    role: account.role,
    status: account.status,
  };
}
