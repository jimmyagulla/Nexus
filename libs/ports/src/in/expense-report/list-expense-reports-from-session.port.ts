import {
  ExpenseReportFilterInput,
  ExpenseReportListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReportsFromSession {
  execute(
    filter?: ExpenseReportFilterInput,
  ): Promise<ExpenseReportListSnapshot>;
}

export const IListExpenseReportsFromSession = Symbol(
  'IListExpenseReportsFromSession',
);
