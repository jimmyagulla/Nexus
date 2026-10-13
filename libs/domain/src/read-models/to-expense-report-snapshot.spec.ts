import { Expense } from '../entities/expense';
import { ExpenseDetails } from '../entities/expense-details';
import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { toExpenseReportSnapshot } from './to-expense-report-snapshot';

function reportWith(vat: number | null): ExpenseReport {
  return new ExpenseReport({
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Déplacement Lyon'),
    status: ExpenseReportStatus.DRAFT,
    expenses: [
      new Expense(
        'x1',
        ExpenseDetails.parse({
          date: '2026-10-05',
          categoryId: 'restaurant',
          amount: 45,
          vat,
          paymentMethod: 'Carte',
          description: 'Déjeuner',
          assignment: 'Client Dupont',
        }),
      ),
    ],
  });
}

describe('toExpenseReportSnapshot', () => {
  it('exposes the report and its expenses as plain values', () => {
    expect(toExpenseReportSnapshot(reportWith(7.5))).toEqual({
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Déplacement Lyon',
      status: 'DRAFT',
      expenses: [
        {
          id: 'x1',
          date: '2026-10-05',
          categoryId: 'restaurant',
          amount: 45,
          vat: 7.5,
          paymentMethod: 'Carte',
          description: 'Déjeuner',
          assignment: 'Client Dupont',
        },
      ],
    });
  });

  it('exposes a missing VAT as null', () => {
    expect(toExpenseReportSnapshot(reportWith(null)).expenses[0]?.vat).toBeNull();
  });
});
