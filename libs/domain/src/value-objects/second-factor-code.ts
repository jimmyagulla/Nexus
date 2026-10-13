import { ErrorCode } from '../errors/error-code';
import { SECOND_FACTOR_CODE_PATTERN } from './second-factor-code.pattern';

export class SecondFactorCode {
  private constructor(readonly value: string) {}

  static parse(raw: string): SecondFactorCode {
    const value = raw.replace(/\s+/g, '');
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (!SECOND_FACTOR_CODE_PATTERN.test(value)) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
    return new SecondFactorCode(value);
  }
}
