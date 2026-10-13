import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface ICreateExpenseReportFromSession {
  execute(label: string): Promise<ExpenseReportSnapshot>;
}

export const ICreateExpenseReportFromSession = Symbol(
  'ICreateExpenseReportFromSession',
);
