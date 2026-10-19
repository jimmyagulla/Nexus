import {
  ExpenseReportProofLink,
} from '@hexagonal-monorepo-template/domain';

export interface IViewExpenseReportProofFromSession {
  execute(expenseReportId: string): Promise<ExpenseReportProofLink>;
}

export const IViewExpenseReportProofFromSession = Symbol('IViewExpenseReportProofFromSession');
