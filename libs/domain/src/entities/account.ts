import { ErrorCode } from '../errors/error-code';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';

export const FAILED_SIGN_IN_LIMIT = 5;

export class Account {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly identifier: AccountIdentifier,
    readonly role: UserRole,
    readonly status: AccountStatus,
    readonly invitationToken: string | null,
    readonly secretHash: string | null,
    readonly failedSignInCount: number = 0,
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
      0,
    );
  }

  isLocked(): boolean {
    return this.failedSignInCount >= FAILED_SIGN_IN_LIMIT;
  }

  recordFailedSignIn(): Account {
    return this.withFailedSignInCount(this.failedSignInCount + 1);
  }

  clearFailedSignIns(): Account {
    return this.withFailedSignInCount(0);
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

  private withFailedSignInCount(failedSignInCount: number): Account {
    return new Account(
      this.id,
      this.companyId,
      this.identifier,
      this.role,
      this.status,
      this.invitationToken,
      this.secretHash,
      failedSignInCount,
    );
  }
}
