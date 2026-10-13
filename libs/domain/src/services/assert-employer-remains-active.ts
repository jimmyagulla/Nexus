import { Account } from '../entities/account';
import { ErrorCode } from '../errors/error-code';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';

export function assertEmployerRemainsActive(
  companyAccounts: readonly Account[],
  target: Account,
): void {
  if (target.role !== UserRole.EMPLOYER) {
    return;
  }
  const otherActiveEmployers = companyAccounts.filter(
    (account) =>
      account.id !== target.id &&
      account.role === UserRole.EMPLOYER &&
      account.status === AccountStatus.ACTIVE,
  );
  if (otherActiveEmployers.length === 0) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
}
