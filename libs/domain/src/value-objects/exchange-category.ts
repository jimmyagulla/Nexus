import { ErrorCode } from '../errors/error-code';

export class ExchangeCategory {
  private constructor(readonly value: string) {}

  static parse(raw: string): ExchangeCategory {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return new ExchangeCategory(value);
  }
}
