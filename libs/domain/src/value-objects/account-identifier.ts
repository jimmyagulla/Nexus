import { ErrorCode } from '../errors/error-code';

export class AccountIdentifier {
  private constructor(readonly value: string) {}

  static parse(raw: string): AccountIdentifier {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new AccountIdentifier(value);
  }
}
