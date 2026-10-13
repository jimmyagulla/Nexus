import { Expense } from '../entities/expense';
import { ExpenseDetails } from '../entities/expense-details';
import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportStatus } from '../entities/expense-report-status';
import { UserRole } from '../identity/user-role';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { toExpenseReportIndicators } from './to-expense-report-indicators';

function report(status: ExpenseReportStatus, amount: number): ExpenseReport {
  return new ExpenseReport({
    id: `${status}-${amount}`,
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Note'),
    status,
    expenses: [
      new Expense(
        'x1',
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
    ],
  });
}

const reports = [
  report(ExpenseReportStatus.DRAFT, 5),
  report(ExpenseReportStatus.SUBMITTED, 10),
  report(ExpenseReportStatus.UNDER_REVIEW, 20.5),
  report(ExpenseReportStatus.VALIDATED, 40),
  report(ExpenseReportStatus.REFUSED, 80),
  report(ExpenseReportStatus.REIMBURSED, 160),
];

describe('toExpenseReportIndicators', () => {
  it('counts for the employer the reports to process and the amount waiting', () => {
    expect(toExpenseReportIndicators(UserRole.EMPLOYER, reports)).toEqual({
      'notes.a-traiter': 2,
      'notes.montant-attente': 30.5,
    });
  });

  it('counts for the employee the reports in progress and their amount', () => {
    expect(toExpenseReportIndicators(UserRole.EMPLOYEE, reports)).toEqual({
      'notes.en-cours': 3,
      'notes.montant-en-cours': 70.5,
    });
  });

  it('counts nothing when there is no report', () => {
    expect(toExpenseReportIndicators(UserRole.EMPLOYER, [])).toEqual({
      'notes.a-traiter': 0,
      'notes.montant-attente': 0,
    });
  });
});
