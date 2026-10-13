import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { NotificationType } from './notification';
import { toExpenseReportNotification } from './to-expense-report-notification';

const report = ExpenseReport.create(
  'r1',
  'c1',
  'e1',
  ExpenseReportLabel.parse('Déplacement Lyon'),
);

const at = new Date('2026-10-06T10:00:00.000Z');

describe('toExpenseReportNotification', () => {
  it('tells the employers that a report was submitted', () => {
    expect(
      toExpenseReportNotification(
        NotificationType.EXPENSE_REPORT_SUBMITTED,
        report,
        at,
      ),
    ).toEqual({
      type: 'note.soumise',
      recipient: { kind: 'EMPLOYERS' },
      companyId: 'c1',
      target: { kind: 'EXPENSE_REPORT', id: 'r1' },
      createdAt: at,
      read: false,
    });
  });

  it.each([
    NotificationType.EXPENSE_REPORT_INFORMATION_REQUESTED,
    NotificationType.EXPENSE_REPORT_VALIDATED,
    NotificationType.EXPENSE_REPORT_REFUSED,
    NotificationType.EXPENSE_REPORT_REIMBURSED,
  ])('tells the employee who wrote the report about %s', (type) => {
    expect(toExpenseReportNotification(type, report, at)).toEqual({
      type,
      recipient: { kind: 'USER', userId: 'e1' },
      companyId: 'c1',
      target: { kind: 'EXPENSE_REPORT', id: 'r1' },
      createdAt: at,
      read: false,
    });
  });

  it('is unread when it is created', () => {
    expect(
      toExpenseReportNotification(
        NotificationType.EXPENSE_REPORT_VALIDATED,
        report,
        at,
      ).read,
    ).toBe(false);
  });
});
