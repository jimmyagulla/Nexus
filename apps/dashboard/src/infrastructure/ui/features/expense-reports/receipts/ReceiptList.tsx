import type { ReceiptViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ReceiptCard } from './ReceiptCard';

interface ReceiptListProps {
  receipts: ReceiptViewModel[];
  onOpen: (receiptId: string) => void;
}

export function ReceiptList({ receipts, onOpen }: ReceiptListProps) {
  if (receipts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.expenseReports.noReceipts}
      </p>
    );
  }

  return (
    <ul>
      {receipts.map((receipt) => (
        <ReceiptCard key={receipt.id} receipt={receipt} onOpen={onOpen} />
      ))}
    </ul>
  );
}
