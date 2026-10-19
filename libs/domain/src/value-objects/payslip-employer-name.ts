import { ErrorCode } from '../errors/error-code';
import { PAYSLIP_EMPLOYER_NAME_MAX_LENGTH } from './payslip-limits';

/** Name of the employer that issued a payslip. */
export class PayslipEmployerName {
  private constructor(readonly value: string) {}

  static parse(raw: string): PayslipEmployerName {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (value.length > PAYSLIP_EMPLOYER_NAME_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new PayslipEmployerName(value);
  }
}
