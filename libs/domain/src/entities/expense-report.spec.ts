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

  it('totals the amounts of its expenses', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68));

    expect(report.total().euros).toBe(125);
  });

  it('totals nothing for a report without expense', () => {
    expect(new ExpenseReport(draftProps()).total().euros).toBe(0);
  });

  it('keeps the cents of the total exact', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 0.1))
      .addExpense(expense('x2', 'parking', 0.2));

    expect(report.total().cents).toBe(30);
  });

  it('lowers the total when an expense is removed', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .addExpense(expense('x3', 'train', 68))
      .removeExpense('x3');

    expect(report.total().euros).toBe(57);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1', 'x2']);
  });

  it('recomputes the total when an expense is modified', () => {
    const report = new ExpenseReport(draftProps())
      .addExpense(expense('x1', 'restaurant', 45))
      .addExpense(expense('x2', 'parking', 12))
      .updateExpense(expense('x2', 'parking', 20));

    expect(report.total().euros).toBe(65);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1', 'x2']);
  });

  it('refuses to modify an expense it does not hold', () => {
    expect(() =>
      new ExpenseReport(draftProps()).updateExpense(expense('x9', 'train', 1)),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses to remove an expense it does not hold', () => {
    expect(() => new ExpenseReport(draftProps()).removeExpense('x9')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.VALIDATED,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])('no longer lets the employee modify or remove an expense once %s', (status) => {
    const report = new ExpenseReport({
      ...draftProps(),
      status,
      expenses: [expense('x1', 'train', 68)],
    });

    expect(() => report.updateExpense(expense('x1', 'train', 70))).toThrow(
      ErrorCode.REQUEST_ALREADY_PROCESSED,
    );
    expect(() => report.removeExpense('x1')).toThrow(
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
