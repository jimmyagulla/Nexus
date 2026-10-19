import {
  ExpenseReportDraft,
  ExpenseReportList,
  ExpenseReportListCriteria,
  ExpenseReportProofLink,
  ExpenseReportRevisionDraft,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IExpenseReportGateway {
  list(
    companyId: string,
    criteria: ExpenseReportListCriteria,
    token: string,
  ): Promise<ExpenseReportList>;
  submit(
    companyId: string,
    draft: ExpenseReportDraft,
    token: string,
  ): Promise<ExpenseReportSummary>;
  revise(
    companyId: string,
    expenseReportId: string,
    draft: ExpenseReportRevisionDraft,
    token: string,
  ): Promise<ExpenseReportSummary>;
  viewProof(
    companyId: string,
    expenseReportId: string,
    token: string,
  ): Promise<ExpenseReportProofLink>;
}

export const IExpenseReportGateway = Symbol('IExpenseReportGateway');
