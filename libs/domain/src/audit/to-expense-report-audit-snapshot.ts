import { ExpenseReport } from '../entities/expense-report';
import { AuditSnapshot } from './audit-snapshot';

export function toExpenseReportAuditSnapshot(
  report: ExpenseReport,
): AuditSnapshot {
  return {
    expenseReportId: report.id,
    expenseReportLabel: report.label.value,
    expenseReportStatus: report.status,
    expenseReportTotal: report.total().euros,
  };
}
