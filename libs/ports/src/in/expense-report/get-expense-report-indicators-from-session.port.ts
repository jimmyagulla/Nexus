import { ExpenseReportIndicators } from '@hexagonal-monorepo-template/domain';

export interface IGetExpenseReportIndicatorsFromSession {
  execute(): Promise<ExpenseReportIndicators>;
}

export const IGetExpenseReportIndicatorsFromSession = Symbol(
  'IGetExpenseReportIndicatorsFromSession',
);
