import { ReceiptFileSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IGetReceiptFromSession {
  execute(input: {
    reportId: string;
    receiptId: string;
  }): Promise<ReceiptFileSnapshot>;
}

export const IGetReceiptFromSession = Symbol('IGetReceiptFromSession');
