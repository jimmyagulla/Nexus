import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Expense } from './expense';
import { ExpenseDetails } from './expense-details';
import { ExpenseReport } from './expense-report';
import { ExpenseReportStatus } from './expense-report-status';

function expense(id: string, categoryId: string, amount: number): Expense {
  return new Expense(
    id,
    ExpenseDetails.parse({
      date: '2026-10-05',
      categoryId,
      amount,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Dépense',
      assignment: 'Client',
    }),
  );
}

function draftProps() {
  return {
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: ExpenseReportLabel.parse('Déplacement Lyon'),
    status: ExpenseReportStatus.DRAFT,
    expenses: [] as readonly Expense[],
  };
}

describe('ExpenseReport', () => {
  it('is created as a draft without any expense', () => {
    const report = ExpenseReport.create(
      'r1',
      'c1',
      'e1',
      ExpenseReportLabel.parse('Déplacement Lyon'),
    );

    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
    expect(report.expenses).toEqual([]);
    expect(report.employeeId).toBe('e1');
    expect(report.companyId).toBe('c1');
    expect(report.label.value).toBe('Déplacement Lyon');
  });

  it('gathers several expenses', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68));

    expect(report.expenses.map((item) => item.details.categoryId)).toEqual([
      'restaurant',
      'parking',
      'train',
    ]);
    expect(report.expenses.map((item) => item.details.amount.euros)).toEqual([
      45, 12, 68,
    ]);
  });

  it('keeps the original report untouched when an expense is added', () => {
    const original = new ExpenseReport(draftProps());

    original.addExpense(expense('x1', 'restaurant', 45));

    expect(original.expenses).toEqual([]);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('no longer accepts an expense once %s', (status) => {
    const report = new ExpenseReport({ ...draftProps(), status });

    expect(() => report.addExpense(expense('x1', 'train', 68))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('exposes the date of an expense as a calendar date', () => {
    expect(expense('x1', 'train', 68).details.date).toEqual(
      CalendarDate.parse('2026-10-05'),
    );
  });
});

describe('ExpenseReportLabel', () => {
  it('refuses a blank label', () => {
    expect(() => ExpenseReportLabel.parse('  ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('trims the label', () => {
    expect(ExpenseReportLabel.parse(' Lyon ').value).toBe('Lyon');
  });
});
