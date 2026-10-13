import { ErrorCode } from '../errors/error-code';
import { ExpenseReportLabel } from '../value-objects/expense-report-label';
import { Expense } from './expense';
import { ExpenseDetails } from './expense-details';
import { ExpenseReport } from './expense-report';
import { ExpenseReportFilter } from './expense-report-filter';
import { ExpenseReportStatus } from './expense-report-status';

function expense(date: string, amount: number): Expense {
  return new Expense(
    `x-${date}-${amount}`,
    ExpenseDetails.parse({
      date,
      categoryId: 'train',
      amount,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Dépense',
      assignment: 'Client',
    }),
  );
}

function report(
  id: string,
  employeeId: string,
  status: ExpenseReportStatus,
  expenses: readonly Expense[],
): ExpenseReport {
  return new ExpenseReport({
    id,
    companyId: 'c1',
    employeeId,
    label: ExpenseReportLabel.parse(id),
    status,
    expenses,
  });
}

const october = report('october', 'e1', ExpenseReportStatus.SUBMITTED, [
  expense('2026-10-05', 45),
  expense('2026-10-20', 12),
]);
const september = report('september', 'e2', ExpenseReportStatus.VALIDATED, [
  expense('2026-09-10', 200),
]);
const empty = report('empty', 'e1', ExpenseReportStatus.DRAFT, []);

const all = [october, september, empty];

function idsMatching(filter: ExpenseReportFilter): string[] {
  return all.filter((item) => filter.matches(item)).map((item) => item.id);
}

describe('ExpenseReportFilter', () => {
  it('keeps every report when nothing is asked', () => {
    expect(idsMatching(ExpenseReportFilter.parse({}))).toEqual([
      'october',
      'september',
      'empty',
    ]);
  });

  it('keeps the reports of one employee', () => {
    expect(
      idsMatching(ExpenseReportFilter.parse({ employeeId: 'e1' })),
    ).toEqual(['october', 'empty']);
  });

  it('keeps the reports in one status', () => {
    expect(
      idsMatching(
        ExpenseReportFilter.parse({ status: ExpenseReportStatus.VALIDATED }),
      ),
    ).toEqual(['september']);
  });

  it('keeps the reports with an expense inside the period, bounds included', () => {
    expect(
      idsMatching(
        ExpenseReportFilter.parse({ from: '2026-10-20', to: '2026-10-31' }),
      ),
    ).toEqual(['october']);
  });

  it('keeps the reports from a date on', () => {
    expect(
      idsMatching(ExpenseReportFilter.parse({ from: '2026-10-01' })),
    ).toEqual(['october']);
  });

  it('keeps the reports until a date', () => {
    expect(idsMatching(ExpenseReportFilter.parse({ to: '2026-09-30' }))).toEqual(
      ['september'],
    );
  });

  it('leaves out a report without expense as soon as a period is asked', () => {
    expect(
      idsMatching(ExpenseReportFilter.parse({ from: '2000-01-01' })),
    ).not.toContain('empty');
  });

  it('keeps the reports whose total is at least the minimum', () => {
    expect(idsMatching(ExpenseReportFilter.parse({ minAmount: 57 }))).toEqual([
      'october',
      'september',
    ]);
    expect(idsMatching(ExpenseReportFilter.parse({ minAmount: 58 }))).toEqual([
      'september',
    ]);
  });

  it('keeps the reports whose total is at most the maximum', () => {
    expect(idsMatching(ExpenseReportFilter.parse({ maxAmount: 57 }))).toEqual([
      'october',
      'empty',
    ]);
    expect(idsMatching(ExpenseReportFilter.parse({ maxAmount: 56 }))).toEqual([
      'empty',
    ]);
  });

  it('combines every criterion', () => {
    expect(
      idsMatching(
        ExpenseReportFilter.parse({
          employeeId: 'e1',
          status: ExpenseReportStatus.SUBMITTED,
          from: '2026-10-01',
          to: '2026-10-31',
          minAmount: 50,
          maxAmount: 60,
        }),
      ),
    ).toEqual(['october']);
  });

  it('refuses a period that ends before it starts', () => {
    expect(() =>
      ExpenseReportFilter.parse({ from: '2026-10-31', to: '2026-10-01' }),
    ).toThrow(ErrorCode.INVALID_PERIOD);
  });

  it('accepts a period of one day', () => {
    expect(() =>
      ExpenseReportFilter.parse({ from: '2026-10-05', to: '2026-10-05' }),
    ).not.toThrow();
  });

  it('refuses a malformed date', () => {
    expect(() => ExpenseReportFilter.parse({ from: 'demain' })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
