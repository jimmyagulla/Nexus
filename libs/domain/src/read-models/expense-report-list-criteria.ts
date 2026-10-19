import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportProofPresence } from '../value-objects/expense-report-proof-presence';
import {
  ExpenseReportSort,
  ExpenseReportSortDirection,
} from '../value-objects/expense-report-sort';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';

/**
 * What an expense reports list shows. Empty lists mean "no restriction".
 * `search` matches the description and the project; `searchCategories` are
 * the categories whose label matches the same search, resolved by the caller
 * that knows the labels.
 */
export type ExpenseReportListCriteria = {
  search: string;
  searchCategories: readonly ExpenseReportCategory[];
  categories: readonly ExpenseReportCategory[];
  statuses: readonly ExpenseReportStatus[];
  projects: readonly string[];
  proofs: readonly ExpenseReportProofPresence[];
  /** Inclusive calendar days of the expense (YYYY-MM-DD), or null. */
  from: string | null;
  to: string | null;
  /** Inclusive amounts including VAT ("12.50"), or null. */
  minAmount: string | null;
  maxAmount: string | null;
  sort: ExpenseReportSort;
  direction: ExpenseReportSortDirection;
};
