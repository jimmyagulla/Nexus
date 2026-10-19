import { ExpenseReport } from '../entities/expense-report';
import { ExpenseReportList, ExpenseReportProjectCount } from '../read-models/expense-report-list';
import { ExpenseReportListCriteria } from '../read-models/expense-report-list-criteria';
import { toExpenseReportSummary } from '../read-models/expense-report-summary';
import { ExpenseAmount } from '../value-objects/expense-amount';
import { EXPENSE_REPORT_CATEGORIES } from '../value-objects/expense-report-category';
import {
  EXPENSE_REPORT_PROOF_PRESENCES,
  ExpenseReportProofPresence,
} from '../value-objects/expense-report-proof-presence';
import {
  ExpenseReportSort,
  ExpenseReportSortDirection,
} from '../value-objects/expense-report-sort';
import { EXPENSE_REPORT_STATUSES } from '../value-objects/expense-report-status';
import { computeExpenseReportStats } from './expense-report-stats';

/** Whether a report carries its receipt, in the terms of the proof filter. */
export function proofPresenceOf(report: ExpenseReport): ExpenseReportProofPresence {
  return report.proof === null
    ? ExpenseReportProofPresence.WITHOUT
    : ExpenseReportProofPresence.WITH;
}

/**
 * Whether a report belongs to a list. The search matches the description or
 * the project (whatever the case and the accents), or a category whose label
 * matches.
 */
export function matchesExpenseReportListCriteria(
  report: ExpenseReport,
  criteria: ExpenseReportListCriteria,
): boolean {
  return (
    matchesSearch(report, criteria) &&
    includedIn(criteria.categories, report.category) &&
    includedIn(criteria.statuses, report.status) &&
    includedIn(criteria.projects, report.project?.value ?? null) &&
    includedIn(criteria.proofs, proofPresenceOf(report)) &&
    withinPeriod(report.date.value, criteria.from, criteria.to) &&
    withinAmounts(report.amount, criteria.minAmount, criteria.maxAmount)
  );
}

/**
 * How many filter groups narrow a list: categories, statuses, projects,
 * receipts, the period and the amounts (one group each, whichever bound is
 * set). The search is not a filter.
 */
export function countAppliedExpenseReportFilters(criteria: ExpenseReportListCriteria): number {
  return [
    criteria.categories.length > 0,
    criteria.statuses.length > 0,
    criteria.projects.length > 0,
    criteria.proofs.length > 0,
    criteria.from !== null || criteria.to !== null,
    criteria.minAmount !== null || criteria.maxAmount !== null,
  ].filter(Boolean).length;
}

/**
 * The list of one owner's reports for the criteria, at an instant: the
 * matching ones in order, the counts the filters show and the key figures,
 * which both ignore the criteria.
 */
export function toExpenseReportList(
  owned: readonly ExpenseReport[],
  criteria: ExpenseReportListCriteria,
  asOf: Date,
): ExpenseReportList {
  return {
    items: owned
      .filter((report) => matchesExpenseReportListCriteria(report, criteria))
      .sort(compareExpenseReports(criteria.sort, criteria.direction))
      .map(toExpenseReportSummary),
    total: owned.length,
    categoryCounts: countBy(EXPENSE_REPORT_CATEGORIES, owned, (report) => report.category),
    statusCounts: countBy(EXPENSE_REPORT_STATUSES, owned, (report) => report.status),
    proofCounts: countBy(EXPENSE_REPORT_PROOF_PRESENCES, owned, proofPresenceOf),
    projectCounts: countProjects(owned),
    stats: computeExpenseReportStats(owned, asOf),
  };
}

/**
 * Order of a list along a column, in either direction; the most recent
 * expense first among equals, then the latest submitted, then the
 * identifier, so that the order is stable. Reports without a project come
 * after the others in ascending order.
 */
export function compareExpenseReports(
  sort: ExpenseReportSort,
  direction: ExpenseReportSortDirection,
): (left: ExpenseReport, right: ExpenseReport) => number {
  const sign = direction === ExpenseReportSortDirection.ASC ? 1 : -1;
  return (left, right) =>
    sign * primaryOrder(sort, left, right) ||
    right.date.value.localeCompare(left.date.value) ||
    right.submittedAt.getTime() - left.submittedAt.getTime() ||
    right.id.localeCompare(left.id);
}

function primaryOrder(sort: ExpenseReportSort, a: ExpenseReport, b: ExpenseReport): number {
  switch (sort) {
    case ExpenseReportSort.AMOUNT:
      return a.amount.cents - b.amount.cents;
    case ExpenseReportSort.CATEGORY:
      return EXPENSE_REPORT_CATEGORIES.indexOf(a.category) - EXPENSE_REPORT_CATEGORIES.indexOf(b.category);
    case ExpenseReportSort.STATUS:
      return EXPENSE_REPORT_STATUSES.indexOf(a.status) - EXPENSE_REPORT_STATUSES.indexOf(b.status);
    case ExpenseReportSort.PROJECT:
      return compareProjects(a.project?.value ?? null, b.project?.value ?? null);
    case ExpenseReportSort.PROOF:
      return EXPENSE_REPORT_PROOF_PRESENCES.indexOf(proofPresenceOf(a)) -
        EXPENSE_REPORT_PROOF_PRESENCES.indexOf(proofPresenceOf(b));
    default:
      return a.date.value.localeCompare(b.date.value) ||
        a.submittedAt.getTime() - b.submittedAt.getTime();
  }
}

function compareProjects(a: string | null, b: string | null): number {
  if (a === null || b === null) {
    return (a === null ? 1 : 0) - (b === null ? 1 : 0);
  }
  return a.localeCompare(b, 'fr', { sensitivity: 'base' });
}

function countBy<K extends string>(
  keys: readonly K[],
  reports: readonly ExpenseReport[],
  keyOf: (report: ExpenseReport) => K,
): Record<K, number> {
  return Object.fromEntries(
    keys.map((key) => [key, reports.filter((report) => keyOf(report) === key).length]),
  ) as Record<K, number>;
}

function countProjects(reports: readonly ExpenseReport[]): ExpenseReportProjectCount[] {
  const counts = new Map<string, number>();
  for (const report of reports) {
    if (report.project !== null) {
      counts.set(report.project.value, (counts.get(report.project.value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([project, count]) => ({ project, count }))
    .sort((left, right) => compareProjects(left.project, right.project));
}

function matchesSearch(report: ExpenseReport, criteria: ExpenseReportListCriteria): boolean {
  const search = comparable(criteria.search);
  return (
    search === '' ||
    comparable(report.description.value).includes(search) ||
    comparable(report.project?.value ?? '').includes(search) ||
    criteria.searchCategories.includes(report.category)
  );
}

/** Case and accents never prevent a match. */
function comparable(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function includedIn<T>(allowed: readonly T[], value: T | null): boolean {
  return allowed.length === 0 || (value !== null && allowed.includes(value));
}

/** Calendar days compare as text (YYYY-MM-DD). */
function withinPeriod(day: string, from: string | null, to: string | null): boolean {
  return (from === null || day >= from) && (to === null || day <= to);
}

/** A bound that is not an amount restricts nothing. */
function withinAmounts(
  amount: ExpenseAmount,
  min: string | null,
  max: string | null,
): boolean {
  const lowest = min === null ? null : ExpenseAmount.read(min);
  const highest = max === null ? null : ExpenseAmount.read(max);
  return (
    (lowest === null || amount.cents >= lowest.cents) &&
    (highest === null || amount.cents <= highest.cents)
  );
}
