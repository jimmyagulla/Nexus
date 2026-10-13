import { ExpenseReport } from '../entities/expense-report';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';

export function requireOwnExpenseReport(
  report: ExpenseReport | null,
  actor: ActorContext,
): ExpenseReport {
  if (report === null || report.employeeId !== actor.userId) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return report;
}
