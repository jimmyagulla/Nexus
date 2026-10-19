import { requireText, requireValid } from '../services/text-rules';
import { PAYSLIP_EMPLOYER_NAME_MAX_LENGTH } from './payslip-limits';

/** Name of the employer that issued a payslip. */
export class PayslipEmployerName {
  private constructor(readonly value: string) {}

  static parse(raw: string): PayslipEmployerName {
    const value = requireText(raw);
    return new PayslipEmployerName(requireValid(value, value.length <= PAYSLIP_EMPLOYER_NAME_MAX_LENGTH));
  }
}
