import { ExpenseReport } from '../entities/expense-report';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';

/**
 * An employee only reaches their own expense reports. A report of someone
 * else is refused exactly like a missing one, so that its existence never
 * leaks.
 */
export function requireOwnedExpenseReport(
  report: ExpenseReport | null,
  actor: ActorContext,
): ExpenseReport {
  if (report === null || !report.isOwnedBy(actor.companyId, actor.userId)) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return report;
}

/** The company an employer handles the expense reports of. */
export function requireEmployerCompany(actor: ActorContext): string {
  if (actor.role !== UserRole.EMPLOYER || actor.companyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return actor.companyId;
}

/** A report of the employer's company; any other is refused like a missing one. */
export function requireCompanyExpenseReport(
  report: ExpenseReport | null,
  actor: ActorContext,
): ExpenseReport {
  const companyId = requireEmployerCompany(actor);
  if (report === null || report.companyId !== companyId) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return report;
}

/** Read by its owner, or by an employer of its company. */
export function requireReadableExpenseReport(
  report: ExpenseReport | null,
  actor: ActorContext,
): ExpenseReport {
  if (report !== null && report.isOwnedBy(actor.companyId, actor.userId)) {
    return report;
  }
  return requireCompanyExpenseReport(report, actor);
}
