import { ReceiptDetails } from './receipt-details';

export class Receipt {
  constructor(
    readonly id: string,
    readonly details: ReceiptDetails,
  ) {}
}
