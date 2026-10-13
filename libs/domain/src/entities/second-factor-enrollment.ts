import { ErrorCode } from '../errors/error-code';
import { SecondFactorEnrollmentStatus } from './second-factor-enrollment-status';

export class SecondFactorEnrollment {
  constructor(
    readonly id: string,
    readonly accountId: string,
    readonly secret: string,
    readonly status: SecondFactorEnrollmentStatus,
  ) {}

  static start(
    id: string,
    accountId: string,
    secret: string,
  ): SecondFactorEnrollment {
    const value = secret.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new SecondFactorEnrollment(
      id,
      accountId,
      value,
      SecondFactorEnrollmentStatus.PENDING,
    );
  }

  isConfirmed(): boolean {
    return this.status === SecondFactorEnrollmentStatus.CONFIRMED;
  }
}
