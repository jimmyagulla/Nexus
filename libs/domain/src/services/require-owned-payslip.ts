import { Payslip } from '../entities/payslip';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

/**
 * An employee only reaches their own payslips. A payslip of someone else is
 * refused exactly like a missing one, so that its existence never leaks.
 */
export function requireOwnedPayslip(
  payslip: Payslip | null,
  actor: ActorContext,
): Payslip {
  if (payslip === null || !payslip.isOwnedBy(actor.companyId, actor.userId)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return payslip;
}
