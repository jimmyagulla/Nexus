import {
  ActorContext,
  ReceiptFileSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IGetReceipt {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    receiptId: string;
  }): Promise<ReceiptFileSnapshot>;
}

export const IGetReceipt = Symbol('IGetReceipt');
