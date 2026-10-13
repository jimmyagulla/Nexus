import {
  ExpenseReportSnapshot,
  ReceiptDetailsInput,
} from '@hexagonal-monorepo-template/domain';

export interface IAttachReceiptFromSession {
  execute(input: {
    reportId: string;
    receipt: ReceiptDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IAttachReceiptFromSession = Symbol('IAttachReceiptFromSession');
