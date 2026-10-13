import {
  ActorContext,
  ExpenseReportSnapshot,
  ReceiptDetailsInput,
} from '@hexagonal-monorepo-template/domain';

export interface IAttachReceipt {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    receipt: ReceiptDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IAttachReceipt = Symbol('IAttachReceipt');
