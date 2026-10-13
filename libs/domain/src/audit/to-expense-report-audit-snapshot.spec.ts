import { Expense } from '../entities/expense';
import { ExpenseDetails } from '../entities/expense-details';
import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { toExpenseReportAuditSnapshot } from './to-expense-report-audit-snapshot';

describe('toExpenseReportAuditSnapshot', () => {
  it('records the identity, the label, the status and the total of a report', () => {
    const report = new ExpenseReport({
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: ExpenseReportLabel.parse('Déplacement Lyon'),
      status: ExpenseReportStatus.SUBMITTED,
      expenses: [45, 12, 68].map(
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

    expect(toExpenseReportAuditSnapshot(report)).toEqual({
      expenseReportId: 'r1',
      expenseReportLabel: 'Déplacement Lyon',
      expenseReportStatus: 'SUBMITTED',
      expenseReportTotal: 125,
    });
  });
});
