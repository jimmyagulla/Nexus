import {
  ActorContext,
  ExpenseReportProofLink,
} from '@hexagonal-monorepo-template/domain';

/** The receipt of a report, for its owner or an employer of its company. */
export interface IViewExpenseReportProof {
  execute(input: {
    actor: ActorContext;
    expenseReportId: string;
  }): Promise<ExpenseReportProofLink>;
}

export const IViewExpenseReportProof = Symbol('IViewExpenseReportProof');
