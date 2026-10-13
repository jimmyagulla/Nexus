import {
  ActorContext,
  ExpenseReportIndicators,
} from '@hexagonal-monorepo-template/domain';

export interface IGetExpenseReportIndicators {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<ExpenseReportIndicators>;
}

export const IGetExpenseReportIndicators = Symbol(
  'IGetExpenseReportIndicators',
);
