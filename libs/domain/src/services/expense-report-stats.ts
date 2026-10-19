import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStats } from '../read-models/expense-report-stats';
import { sumOfExpenseAmounts } from '../value-objects/expense-amount';
import {
  ExpenseReportStatus,
  isPendingExpenseReportStatus,
} from '../value-objects/expense-report-status';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Key figures of one owner's reports at an instant: what waits for a refund,
 * what was refunded during the year of that instant (UTC), and how long the
 * processed reports took, from their submission to their refund or refusal.
 */
export function computeExpenseReportStats(
  owned: readonly ExpenseReport[],
  asOf: Date,
): ExpenseReportStats {
  const pending = owned.filter((report) => isPendingExpenseReportStatus(report.status));
  const year = asOf.getUTCFullYear();
  const refunded = owned.filter(
    (report) =>
      report.status === ExpenseReportStatus.REFUNDED &&
      report.processedAt?.getUTCFullYear() === year,
  );
  return {
    pending: {
      count: pending.length,
      amount: sumOfExpenseAmounts(pending.map((report) => report.amount)).value,
    },
    refunded: {
      year,
      amount: sumOfExpenseAmounts(refunded.map((report) => report.amount)).value,
    },
    averageProcessingDays: averageProcessingDays(owned),
  };
}

function averageProcessingDays(owned: readonly ExpenseReport[]): number | null {
  const durations = owned.flatMap((report) =>
    report.processedAt === null
      ? []
      : [(report.processedAt.getTime() - report.submittedAt.getTime()) / DAY_MS],
  );
  if (durations.length === 0) {
    return null;
  }
  const mean = durations.reduce((total, days) => total + days, 0) / durations.length;
  return Math.max(0, Math.round(mean));
}
