import { ExpenseReportSnapshot } from './expense-report-snapshot';

export type ExpenseReportListSnapshot = {
  canCreate: boolean;
  reports: readonly ExpenseReportSnapshot[];
};
