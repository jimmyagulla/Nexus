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
    readonly failedSignInCount = 0,
    readonly employeeId: string | null = null,
  ) {}

  static inviteEmployer(
    id: string,
    companyId: string,
    identifier: AccountIdentifier,
    invitationToken: string,
  ): Account {
    return Account.invite(
      id,
      companyId,
      identifier,
      UserRole.EMPLOYER,
      invitationToken,
      null,
    );
  }

  static inviteEmployee(
    id: string,
    companyId: string,
    identifier: AccountIdentifier,
    invitationToken: string,
    employeeId: string,
  ): Account {
    return Account.invite(
      id,
      companyId,
      identifier,
      UserRole.EMPLOYEE,
      invitationToken,
      employeeId,
    );
  }

  private static invite(
    id: string,
    companyId: string,
    identifier: AccountIdentifier,
    role: UserRole,
    invitationToken: string,
    employeeId: string | null,
  ): Account {
    const token = invitationToken.trim();
    if (token === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new Account(
      id,
      companyId,
      identifier,
      role,
      AccountStatus.INVITED,
      token,
      null,
      0,
      employeeId,
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
      0,
      this.employeeId,
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
      this.employeeId,
    );
  }
}
