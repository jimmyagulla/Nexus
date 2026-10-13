import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { UserRole } from '../identity/user-role';
import { Money } from '../value-objects/money';

export type ExpenseReportIndicators = Readonly<Record<string, number>>;

const TO_PROCESS: readonly ExpenseReportStatus[] = [
  ExpenseReportStatus.SUBMITTED,
  ExpenseReportStatus.UNDER_REVIEW,
];

const IN_PROGRESS: readonly ExpenseReportStatus[] = [
  ExpenseReportStatus.SUBMITTED,
  ExpenseReportStatus.UNDER_REVIEW,
  ExpenseReportStatus.VALIDATED,
];

export function toExpenseReportIndicators(
  role: UserRole,
  reports: readonly ExpenseReport[],
): ExpenseReportIndicators {
  const employer = role === UserRole.EMPLOYER;
  const concerned = reports.filter((report) =>
    (employer ? TO_PROCESS : IN_PROGRESS).includes(report.status),
  );
  const amount = concerned.reduce(
    (sum, report) => sum.plus(report.total()),
    Money.zero(),
  ).euros;
  return employer
    ? { 'notes.a-traiter': concerned.length, 'notes.montant-attente': amount }
    : {
        'notes.en-cours': concerned.length,
        'notes.montant-en-cours': amount,
      };
}
