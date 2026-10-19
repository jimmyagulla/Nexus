import {
  ExpenseReport,
  ExpenseReportProps,
  OwnerScope,
} from '@hexagonal-monorepo-template/domain';

/** An expense report about to be recorded: everything but its identifier. */
export type NewExpenseReport = Omit<ExpenseReportProps, 'id'>;

export interface IExpenseReportRepository {
  insert(report: NewExpenseReport): Promise<ExpenseReport>;
  save(report: ExpenseReport): Promise<void>;
  findById(expenseReportId: string): Promise<ExpenseReport | null>;
  /** Every expense report of one person in one company. */
  listOwned(scope: OwnerScope): Promise<ExpenseReport[]>;
}

export const IExpenseReportRepository = Symbol('IExpenseReportRepository');
