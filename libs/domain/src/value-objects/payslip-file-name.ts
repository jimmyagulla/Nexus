import { requireText, requireValid } from '../services/text-rules';
import { PAYSLIP_FILE_NAME_MAX_LENGTH } from './payslip-limits';

/** Name of the file of a payslip, as the employer gave it. */
export class PayslipFileName {
  private constructor(readonly value: string) {}

  static parse(raw: string): PayslipFileName {
    const value = requireText(raw);
    return new PayslipFileName(requireValid(value, value.length <= PAYSLIP_FILE_NAME_MAX_LENGTH));
  }
}
