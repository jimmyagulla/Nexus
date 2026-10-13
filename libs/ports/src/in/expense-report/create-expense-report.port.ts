import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface ICreateExpenseReport {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    label: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const ICreateExpenseReport = Symbol('ICreateExpenseReport');
