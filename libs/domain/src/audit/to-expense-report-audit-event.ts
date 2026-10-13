import { ExpenseReport } from '../entities/expense-report';
import { AuditAction } from './audit-action';
import { AuditEvent } from './audit-event';
import { AuditSubject } from './audit-subject';
import { toExpenseReportAuditSnapshot } from './to-expense-report-audit-snapshot';

export const ExpenseReportAuditKind = {
  SUBMITTED: 'SUBMITTED',
  INFORMATION_REQUESTED: 'INFORMATION_REQUESTED',
  VALIDATED: 'VALIDATED',
  REFUSED: 'REFUSED',
  REIMBURSED: 'REIMBURSED',
} as const;

export type ExpenseReportAuditKind =
  (typeof ExpenseReportAuditKind)[keyof typeof ExpenseReportAuditKind];

const ACTIONS: Record<ExpenseReportAuditKind, AuditAction> = {
  SUBMITTED: AuditAction.TRANSMISSION,
  INFORMATION_REQUESTED: AuditAction.MODIFICATION,
  VALIDATED: AuditAction.VALIDATION,
  REFUSED: AuditAction.REFUSAL,
  REIMBURSED: AuditAction.STATUS_CHANGE,
};

export function toExpenseReportAuditEvent(input: {
  kind: ExpenseReportAuditKind;
  actorId: string;
  before: ExpenseReport;
  after: ExpenseReport;
  occurredAt: Date;
}): Omit<AuditEvent, 'id'> {
  return {
    companyId: input.after.companyId,
    actorId: input.actorId,
    occurredAt: input.occurredAt,
    action: ACTIONS[input.kind],
    subject: AuditSubject.EXPENSE_REPORT,
    before: toExpenseReportAuditSnapshot(input.before),
    after: toExpenseReportAuditSnapshot(input.after),
    sentence: sentenceOf(input.kind, input.after),
  };
}

function sentenceOf(
  kind: ExpenseReportAuditKind,
  report: ExpenseReport,
): string {
  const total = formatEuros(report.total().euros);
  const label = report.label.value;
  switch (kind) {
    case ExpenseReportAuditKind.SUBMITTED:
      return `Note de frais « ${label} » soumise (${total}).`;
    case ExpenseReportAuditKind.INFORMATION_REQUESTED:
      return `Complément demandé sur la note de frais « ${label} » (${total}).`;
    case ExpenseReportAuditKind.VALIDATED:
      return `Note de frais « ${label} » validée (${total}).`;
    case ExpenseReportAuditKind.REFUSED:
      return `Note de frais « ${label} » refusée (${total}).`;
    case ExpenseReportAuditKind.REIMBURSED:
      return `Note de frais « ${label} » remboursée (${total}).`;
  }
}

function formatEuros(euros: number): string {
  const text = Number.isInteger(euros)
    ? String(euros)
    : euros.toFixed(2).replace('.', ',');
  return `${text} €`;
}
