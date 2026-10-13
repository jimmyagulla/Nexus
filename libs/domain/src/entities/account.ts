import { ErrorCode } from '../errors/error-code';
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
    readonly invitationToken: string | null,
    readonly secretHash: string | null,
  ) {}

  static inviteEmployer(
    id: string,
    companyId: string,
    identifier: AccountIdentifier,
    invitationToken: string,
  ): Account {
    const token = invitationToken.trim();
    if (token === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new Account(
      id,
      companyId,
      identifier,
      UserRole.EMPLOYER,
      AccountStatus.INVITED,
      token,
      null,
    );
  }

  activate(secretHash: string): Account {
    if (
      this.status !== AccountStatus.INVITED ||
      this.invitationToken === null
    ) {
      throw new Error(ErrorCode.INVITATION_INVALID);
    }
    return new Account(
      this.id,
      this.companyId,
      this.identifier,
      this.role,
      AccountStatus.ACTIVE,
      null,
      secretHash,
    );
  }
}
