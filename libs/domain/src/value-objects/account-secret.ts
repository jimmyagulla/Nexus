import { ErrorCode } from '../errors/error-code';

export class AccountSecret {
  private constructor(readonly value: string) {}

  static parse(raw: string): AccountSecret {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new AccountSecret(value);
  }
}
