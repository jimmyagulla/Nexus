import { Expense } from '../entities/expense';
import { ExpenseDetails } from '../entities/expense-details';
import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { AuditAction } from './audit-action';
import { AuditSubject } from './audit-subject';
import {
  ExpenseReportAuditKind,
  toExpenseReportAuditEvent,
} from './to-expense-report-audit-event';

const at = new Date('2026-10-06T10:00:00.000Z');

function reportIn(
  status: ExpenseReportStatus,
  amounts: number[],
): ExpenseReport {
  return new ExpenseReport({
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Déplacement Lyon'),
    status,
    expenses: amounts.map(
      (amount, index) =>
        new Expense(
          `x${index}`,
          ExpenseDetails.parse({
            date: '2026-10-05',
            categoryId: 'train',
            amount,
            vat: null,
            paymentMethod: 'Carte',
            description: 'Dépense',
            assignment: 'Client',
          }),
        ),
    ),
  });
}

function eventFor(kind: ExpenseReportAuditKind, amounts = [45, 12, 68]) {
  return toExpenseReportAuditEvent({
    kind,
    actorId: 'u1',
    before: reportIn(ExpenseReportStatus.DRAFT, amounts),
    after: reportIn(ExpenseReportStatus.SUBMITTED, amounts),
    occurredAt: at,
  });
}

describe('toExpenseReportAuditEvent', () => {
  it('records who, what, when and the total', () => {
    expect(eventFor(ExpenseReportAuditKind.SUBMITTED)).toEqual({
      companyId: 'c1',
      actorId: 'u1',
      occurredAt: at,
      action: AuditAction.TRANSMISSION,
      subject: AuditSubject.EXPENSE_REPORT,
      before: {
        expenseReportId: 'r1',
        expenseReportLabel: 'Déplacement Lyon',
        expenseReportStatus: 'DRAFT',
        expenseReportTotal: 125,
      },
      after: {
        expenseReportId: 'r1',
        expenseReportLabel: 'Déplacement Lyon',
        expenseReportStatus: 'SUBMITTED',
        expenseReportTotal: 125,
      },
      sentence: 'Note de frais « Déplacement Lyon » soumise (125 €).',
    });
  });

  it.each([
    [ExpenseReportAuditKind.SUBMITTED, AuditAction.TRANSMISSION],
    [ExpenseReportAuditKind.INFORMATION_REQUESTED, AuditAction.MODIFICATION],
    [ExpenseReportAuditKind.VALIDATED, AuditAction.VALIDATION],
    [ExpenseReportAuditKind.REFUSED, AuditAction.REFUSAL],
    [ExpenseReportAuditKind.REIMBURSED, AuditAction.STATUS_CHANGE],
  ])('files %s under the action %s', (kind, action) => {
    expect(eventFor(kind).action).toBe(action);
  });

  it.each([
    [ExpenseReportAuditKind.SUBMITTED, 'soumise'],
    [ExpenseReportAuditKind.INFORMATION_REQUESTED, 'Complément demandé'],
    [ExpenseReportAuditKind.VALIDATED, 'validée'],
    [ExpenseReportAuditKind.REFUSED, 'refusée'],
    [ExpenseReportAuditKind.REIMBURSED, 'remboursée'],
  ])(
    'writes a sentence about %s that names the report and its total',
    (kind, word) => {
      const { sentence } = eventFor(kind);

      expect(sentence).toContain(word);
      expect(sentence).toContain('« Déplacement Lyon »');
      expect(sentence).toContain('125 €');
    },
  );

  it('never calls the report a professional expense', () => {
    for (const kind of Object.values(ExpenseReportAuditKind)) {
      expect(eventFor(kind).sentence?.toLowerCase()).not.toContain(
        'professionnel',
      );
    }
  });

  it('writes the total with cents when it has some', () => {
    expect(eventFor(ExpenseReportAuditKind.VALIDATED, [12.5]).sentence).toBe(
      'Note de frais « Déplacement Lyon » validée (12,50 €).',
    );
  });
});
