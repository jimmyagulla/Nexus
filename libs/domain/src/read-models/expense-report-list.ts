import { ExpenseReportCategory } from '../value-objects/expense-report-category';
import { ExpenseReportProofPresence } from '../value-objects/expense-report-proof-presence';
import { ExpenseReportStatus } from '../value-objects/expense-report-status';
import { ExpenseReportStats } from './expense-report-stats';
import { ExpenseReportSummary } from './expense-report-summary';
import { FileLink } from './file-link';

/** A project the owner charged expenses to, and how many. */
export type ExpenseReportProjectCount = {
  project: string;
  count: number;
};

/** The expense reports list, with the counts the filters display and the key figures. */
export type ExpenseReportList = {
  items: readonly ExpenseReportSummary[];
  /** Every expense report of the owner, whatever the criteria. */
  total: number;
  /** Counts of the owner's reports, whatever the criteria. */
  categoryCounts: Readonly<Record<ExpenseReportCategory, number>>;
  statusCounts: Readonly<Record<ExpenseReportStatus, number>>;
  proofCounts: Readonly<Record<ExpenseReportProofPresence, number>>;
  /** Projects of the owner's reports, alphabetically. */
  projectCounts: readonly ExpenseReportProjectCount[];
  stats: ExpenseReportStats;
};

/** Link to the receipt of an expense report, valid for a short while. */
export type ExpenseReportProofLink = FileLink;
