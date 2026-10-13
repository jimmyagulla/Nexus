import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';

export class Account {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly identifier: AccountIdentifier,
    readonly role: UserRole,
    readonly status: AccountStatus,
  ) {}

  static inviteEmployer(
    id: string,
    companyId: string,
    identifier: AccountIdentifier,
  ): Account {
    return new Account(
      id,
      companyId,
      identifier,
      UserRole.EMPLOYER,
      AccountStatus.INVITED,
    );
  }
}
