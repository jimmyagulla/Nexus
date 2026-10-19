import { ExpenseReport } from '../entities/expense-report';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseAmount } from '../value-objects/expense-amount';
import { ExpenseReportDescription } from '../value-objects/expense-report-description';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';
import { computeExpenseReportStats } from './expense-report-stats';

function expense(
  amount: string,
  status: ExpenseReportStatus,
  submittedAt = '2026-09-01T10:00:00Z',
  processedAt: string | null = null,
): ExpenseReport {
  return new ExpenseReport({
    id: `${amount}-${status}`,
    companyId: 'c1',
    ownerId: 'u1',
    date: CalendarDate.parse('2026-08-30'),
    category: 'OTHER',
    paymentMethod: 'CASH',
    amount: ExpenseAmount.parse(amount),
    vat: null,
    description: ExpenseReportDescription.parse('Dépense'),
    project: null,
    proof: null,
    status,
    submittedAt: new Date(submittedAt),
    processedAt: processedAt === null ? null : new Date(processedAt),
  });
}

const asOf = new Date('2026-10-19T12:00:00Z');

describe('computeExpenseReportStats', () => {
  it('sums what waits for a refund: submitted or being processed', () => {
    const stats = computeExpenseReportStats([
      expense('112', ExpenseReportStatus.IN_PROGRESS),
      expense('42,50', ExpenseReportStatus.SUBMITTED),
      expense('18', ExpenseReportStatus.REJECTED, '2026-06-01T10:00:00Z', '2026-06-05T10:00:00Z'),
    ], asOf);

    expect(stats.pending).toEqual({ count: 2, amount: '154.50' });
  });

  it('sums what was refunded during the current year only', () => {
    const stats = computeExpenseReportStats([
      expense('186,40', ExpenseReportStatus.REFUNDED, '2026-08-20T10:00:00Z', '2026-09-01T10:00:00Z'),
      expense('58', ExpenseReportStatus.REFUNDED, '2025-12-20T10:00:00Z', '2026-01-02T10:00:00Z'),
      expense('99', ExpenseReportStatus.REFUNDED, '2025-11-01T10:00:00Z', '2025-11-20T10:00:00Z'),
    ], asOf);

    expect(stats.refunded).toEqual({ year: 2026, amount: '244.40' });
  });

  it('averages the days from submission to refund or refusal', () => {
    const stats = computeExpenseReportStats([
      expense('10', ExpenseReportStatus.REFUNDED, '2026-09-01T10:00:00Z', '2026-09-11T10:00:00Z'),
      expense('20', ExpenseReportStatus.REJECTED, '2026-09-01T10:00:00Z', '2026-09-15T10:00:00Z'),
      expense('30', ExpenseReportStatus.SUBMITTED),
    ], asOf);

    expect(stats.averageProcessingDays).toBe(12);
  });

  it('has no average before any report is processed', () => {
    expect(computeExpenseReportStats([expense('30', ExpenseReportStatus.SUBMITTED)], asOf)).toEqual({
      pending: { count: 1, amount: '30.00' },
      refunded: { year: 2026, amount: '0.00' },
      averageProcessingDays: null,
    });
  });
});
