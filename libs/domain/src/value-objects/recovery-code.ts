import { ErrorCode } from '../errors/error-code';
import { RECOVERY_CODE_PATTERN } from './recovery-code.rules';

export class RecoveryCode {
  private constructor(readonly value: string) {}

  static parse(raw: string): RecoveryCode {
    const value = raw.replace(/[\s-]+/g, '').toUpperCase();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (!RECOVERY_CODE_PATTERN.test(value)) {
      throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
    }
    return new RecoveryCode(value);
  }
}
