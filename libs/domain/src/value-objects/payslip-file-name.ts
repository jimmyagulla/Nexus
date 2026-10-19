import { ErrorCode } from '../errors/error-code';
import { PAYSLIP_FILE_NAME_MAX_LENGTH } from './payslip-limits';

/** Name of the file of a payslip, as the employer gave it. */
export class PayslipFileName {
  private constructor(readonly value: string) {}

  static parse(raw: string): PayslipFileName {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (value.length > PAYSLIP_FILE_NAME_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new PayslipFileName(value);
  }
}
