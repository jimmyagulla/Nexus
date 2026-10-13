import { Account } from '../entities/account';
import { ErrorCode } from '../errors/error-code';

export function requireCompanyAccount(
  companyAccounts: readonly Account[],
  accountId: string,
): Account {
  const account = companyAccounts.find(({ id }) => id === accountId);
  if (account === undefined) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return account;
}
