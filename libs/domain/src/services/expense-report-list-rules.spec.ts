import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportListCriteria } from '../read-models/expense-report-list-criteria';
import { CalendarDate } from '../value-objects/calendar-date';
import { ExpenseAmount } from '../value-objects/expense-amount';
import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportDescription } from '../value-objects/expense-report-description';
import { ExpenseReportPaymentMethod } from '../value-objects/expense-report-payment-method';
import { ExpenseReportProject } from '../value-objects/expense-report-project';
import { ExpenseReportSort } from '../value-objects/expense-report-sort';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';
import {
  compareExpenseReports,
  countAppliedExpenseReportFilters,
  matchesExpenseReportListCriteria,
  toExpenseReportList,
} from './expense-report-list-rules';

function expense(id: string, overrides: Partial<{
  date: string; category: ExpenseReportCategory; amount: string; description: string;
  project: string; withProof: boolean; status: ExpenseReportStatus;
}> = {}): ExpenseReport {
  return new ExpenseReport({
    id,
    companyId: 'c1',
    ownerId: 'u1',
    date: CalendarDate.parse(overrides.date ?? '2026-09-12'),
    category: overrides.category ?? ExpenseReportCategory.OTHER,
    paymentMethod: ExpenseReportPaymentMethod.CASH,
    amount: ExpenseAmount.parse(overrides.amount ?? '10'),
    vat: null,
    description: ExpenseReportDescription.parse(overrides.description ?? `Dépense ${id}`),
    project: ExpenseReportProject.parse(overrides.project),
    proof: overrides.withProof ? { fileName: 'r.pdf', format: 'PDF', sizeBytes: 3, storageKey: `k-${id}` } : null,
    status: overrides.status ?? ExpenseReportStatus.SUBMITTED,
    submittedAt: new Date('2026-09-20T10:00:00Z'),
    processedAt: null,
  });
}

const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null,
  sort: ExpenseReportSort.DATE, direction: 'DESC' as const,
};

describe('matchesExpenseReportListCriteria', () => {
  it('keeps every report without criteria', () => {
    expect(matchesExpenseReportListCriteria(expense('1'), everything)).toBe(true);
  });

  it('matches the description or the project, whatever the case and the accents', () => {
    const train = expense('1', { description: 'Billet Montpellier – Lyon', project: 'Client Valette' });

    expect(matchesExpenseReportListCriteria(train, { ...everything, search: 'LYON' })).toBe(true);
    expect(matchesExpenseReportListCriteria(train, { ...everything, search: 'valette' })).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('2', { description: 'Hôtel Ibis' }), { ...everything, search: 'hotel' })).toBe(true);
    expect(matchesExpenseReportListCriteria(train, { ...everything, search: 'parking' })).toBe(false);
  });

  it('matches a category whose label matches the search', () => {
    const parking = expense('1', { description: 'Polygone', category: ExpenseReportCategory.PARKING });

    expect(matchesExpenseReportListCriteria(parking, { ...everything, search: 'park', searchCategories: [ExpenseReportCategory.PARKING] })).toBe(true);
  });

  it('keeps the chosen categories, statuses, projects and receipts only', () => {
    const report = expense('1', { category: ExpenseReportCategory.MEAL, project: 'Salon', withProof: true });

    expect(matchesExpenseReportListCriteria(report, { ...everything, categories: [ExpenseReportCategory.MEAL] })).toBe(true);
    expect(matchesExpenseReportListCriteria(report, { ...everything, categories: [ExpenseReportCategory.HOTEL] })).toBe(false);
    expect(matchesExpenseReportListCriteria(report, { ...everything, statuses: [ExpenseReportStatus.REFUNDED] })).toBe(false);
    expect(matchesExpenseReportListCriteria(report, { ...everything, projects: ['Salon'] })).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('2'), { ...everything, projects: ['Salon'] })).toBe(false);
    expect(matchesExpenseReportListCriteria(report, { ...everything, proofs: ['WITH'] })).toBe(true);
    expect(matchesExpenseReportListCriteria(report, { ...everything, proofs: ['WITHOUT'] })).toBe(false);
  });

  it('keeps the expenses of the period, both days included', () => {
    const criteria = { ...everything, from: '2026-09-01', to: '2026-09-30' };

    expect(matchesExpenseReportListCriteria(expense('1', { date: '2026-09-01' }), criteria)).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('2', { date: '2026-09-30' }), criteria)).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('3', { date: '2026-10-01' }), criteria)).toBe(false);
  });

  it('keeps the amounts between the bounds, both included, and ignores a bound that is not an amount', () => {
    const criteria = { ...everything, minAmount: '12,50', maxAmount: '68' };

    expect(matchesExpenseReportListCriteria(expense('1', { amount: '12,50' }), criteria)).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('2', { amount: '68' }), criteria)).toBe(true);
    expect(matchesExpenseReportListCriteria(expense('3', { amount: '68,01' }), criteria)).toBe(false);
    expect(matchesExpenseReportListCriteria(expense('4', { amount: '5' }), { ...everything, minAmount: 'abc' })).toBe(true);
  });
});

describe('countAppliedExpenseReportFilters', () => {
  it('counts one group per kind of filter, the search apart', () => {
    expect(countAppliedExpenseReportFilters({ ...everything, search: 'lyon' })).toBe(0);
    expect(countAppliedExpenseReportFilters({
      ...everything, categories: ['MEAL'], statuses: ['SUBMITTED'], projects: ['Salon'], proofs: ['WITH'],
      to: '2026-09-30', minAmount: '10',
    })).toBe(6);
  });
});

describe('compareExpenseReports', () => {
  const order = (reports: ExpenseReport[], sort: ExpenseReportSort, direction: 'ASC' | 'DESC') =>
    [...reports].sort(compareExpenseReports(sort, direction)).map((report) => report.id);

  it('orders by amount as numbers, not as text', () => {
    const reports = [expense('a', { amount: '9' }), expense('b', { amount: '112' }), expense('c', { amount: '42,5' })];

    expect(order(reports, ExpenseReportSort.AMOUNT, 'ASC')).toEqual(['a', 'c', 'b']);
    expect(order(reports, ExpenseReportSort.AMOUNT, 'DESC')).toEqual(['b', 'c', 'a']);
  });

  it('orders the most recent expense first by default', () => {
    const reports = [expense('a', { date: '2026-08-01' }), expense('b', { date: '2026-09-28' })];

    expect(order(reports, ExpenseReportSort.DATE, 'DESC')).toEqual(['b', 'a']);
  });

  it('puts the reports without a project last in ascending order', () => {
    const reports = [expense('a'), expense('b', { project: 'Valette' }), expense('c', { project: 'Atelier' })];

    expect(order(reports, ExpenseReportSort.PROJECT, 'ASC')).toEqual(['c', 'b', 'a']);
  });

  it('orders the reports with a receipt before the others in ascending order', () => {
    const reports = [expense('a'), expense('b', { withProof: true })];

    expect(order(reports, ExpenseReportSort.PROOF, 'ASC')).toEqual(['b', 'a']);
  });
});

describe('toExpenseReportList', () => {
  it('counts every report of the owner, whatever the criteria', () => {
    const owned = [
      expense('a', { category: ExpenseReportCategory.MEAL, project: 'Salon', withProof: true }),
      expense('b', { category: ExpenseReportCategory.MEAL, project: 'Atelier' }),
      expense('c', { category: ExpenseReportCategory.HOTEL, project: 'Salon', status: ExpenseReportStatus.REFUNDED }),
    ];

    const list = toExpenseReportList(owned, { ...everything, categories: [ExpenseReportCategory.HOTEL] }, new Date('2026-10-19T00:00:00Z'));

    expect(list.items.map((item) => item.id)).toEqual(['c']);
    expect([list.total, list.categoryCounts.MEAL, list.statusCounts.REFUNDED, list.proofCounts]).toEqual([
      3, 2, 1, { WITH: 1, WITHOUT: 2 },
    ]);
    expect(list.projectCounts).toEqual([{ project: 'Atelier', count: 1 }, { project: 'Salon', count: 2 }]);
  });
});
