import { ErrorCode } from '../errors/error-code';

export class SecondFactor {
  private constructor(
    readonly userId: string,
    readonly companyId: string,
    readonly secret: string,
    private readonly enrolled: boolean,
  ) {}

  static begin(userId: string, companyId: string, secret: string): SecondFactor {
    return new SecondFactor(userId, companyId, secret, false);
  }

  static restore(input: {
    userId: string;
    companyId: string;
    secret: string;
    enrolled: boolean;
  }): SecondFactor {
    return new SecondFactor(
      input.userId,
      input.companyId,
      input.secret,
      input.enrolled,
    );
  }

  isEnrolled(): boolean {
    return this.enrolled;
  }

  confirm(): SecondFactor {
    if (this.enrolled) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return new SecondFactor(this.userId, this.companyId, this.secret, true);
  }
}
