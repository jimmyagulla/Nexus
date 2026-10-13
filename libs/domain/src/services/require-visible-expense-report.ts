import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireOwnExpenseReport } from './require-own-expense-report';

export function requireVisibleExpenseReport(
  report: ExpenseReport | null,
  actor: ActorContext,
): ExpenseReport {
  if (actor.role === UserRole.EMPLOYEE) {
    return requireOwnExpenseReport(report, actor);
  }
  if (
    actor.role === UserRole.EMPLOYER &&
    report !== null &&
    report.status !== ExpenseReportStatus.DRAFT
  ) {
    return report;
  }
  throw new Error(ErrorCode.ACCESS_DENIED);
}
