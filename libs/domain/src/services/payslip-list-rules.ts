import { Payslip } from '../entities/payslip';
import { PayslipList } from '../read-models/payslip-list';
import { PayslipListCriteria } from '../read-models/payslip-list-criteria';
import { toPayslipSummary } from '../read-models/payslip-summary';

/** Whether a payslip belongs to a list: its year, or any year. */
export function matchesPayslipListCriteria(
  payslip: Payslip,
  criteria: PayslipListCriteria,
): boolean {
  return criteria.year === null || payslip.period.year === criteria.year;
}

/** Chronological order, January to December; the identifier among equals. */
export function comparePayslips(left: Payslip, right: Payslip): number {
  return left.period.compare(right.period) || left.id.localeCompare(right.id);
}

/** Distinct years, oldest first. */
export function payslipYearsOf(years: readonly number[]): number[] {
  return [...new Set(years)].sort((left, right) => left - right);
}

/**
 * The list of one employee's payslips for the criteria: the matching ones in
 * order, and what the year picker shows, which ignores the criteria.
 */
export function toPayslipList(
  owned: readonly Payslip[],
  criteria: PayslipListCriteria,
): PayslipList {
  return {
    items: owned
      .filter((payslip) => matchesPayslipListCriteria(payslip, criteria))
      .sort(comparePayslips)
      .map(toPayslipSummary),
    total: owned.length,
    years: payslipYearsOf(owned.map((payslip) => payslip.period.year)),
  };
}

/**
 * The list of one year, read from the list of every year: the same counts
 * and years, the payslips of that year only, still January to December.
 */
export function payslipListOfYear(everyYear: PayslipList, year: number): PayslipList {
  return { ...everyYear, items: everyYear.items.filter((item) => item.year === year) };
}

/** The year a payslips screen opens on: the latest with a payslip, else the current one. */
export function defaultPayslipYear(years: readonly number[], today: Date): number {
  return years.length === 0 ? today.getFullYear() : Math.max(...years);
}

/** The years with a payslip right before and right after a year, null when none. */
export function adjacentPayslipYears(
  years: readonly number[],
  year: number,
): { previous: number | null; next: number | null } {
  const before = years.filter((candidate) => candidate < year);
  const after = years.filter((candidate) => candidate > year);
  return {
    previous: before.length === 0 ? null : Math.max(...before),
    next: after.length === 0 ? null : Math.min(...after),
  };
}
