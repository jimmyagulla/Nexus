import { ErrorCode } from '../errors/error-code';

export class SecondFactor {
  private constructor(
    readonly userId: string,
    readonly companyId: string,
    readonly secret: string,
    private readonly enrolled: boolean,
    readonly recoveryCodeDigests: readonly string[],
  ) {}

  static begin(userId: string, companyId: string, secret: string): SecondFactor {
    return new SecondFactor(userId, companyId, secret, false, []);
  }

  static restore(input: {
    userId: string;
    companyId: string;
    secret: string;
    enrolled: boolean;
    recoveryCodeDigests: readonly string[];
  }): SecondFactor {
    return new SecondFactor(
      input.userId,
      input.companyId,
      input.secret,
      input.enrolled,
      input.recoveryCodeDigests,
    );
  }

  isEnrolled(): boolean {
    return this.enrolled;
  }

  confirm(recoveryCodeDigests: readonly string[]): SecondFactor {
    if (this.enrolled) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return new SecondFactor(
      this.userId,
      this.companyId,
      this.secret,
      true,
      recoveryCodeDigests,
    );
  }

  consumeRecoveryCode(digest: string): SecondFactor {
    if (!this.recoveryCodeDigests.includes(digest)) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
    return new SecondFactor(
      this.userId,
      this.companyId,
      this.secret,
      this.enrolled,
      this.recoveryCodeDigests.filter((candidate) => candidate !== digest),
    );
  }
}
