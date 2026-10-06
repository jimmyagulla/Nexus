import { ErrorCode } from '../errors/error-code';

export class CompanyName {
  private constructor(readonly value: string) {}

  static parse(raw: string): CompanyName {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new CompanyName(value);
  }
}
