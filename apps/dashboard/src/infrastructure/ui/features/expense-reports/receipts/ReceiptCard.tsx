import type { ReceiptViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

interface ReceiptCardProps {
  receipt: ReceiptViewModel;
  onOpen: (receiptId: string) => void;
}

export function ReceiptCard({ receipt, onOpen }: ReceiptCardProps) {
  return (
    <li className="flex items-center gap-4 py-1">
      <span>{receipt.fileName}</span>
      <span className="text-muted-foreground">{receipt.size}</span>
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpen(receipt.id)}
      >
        {i18n.messages.expenseReports.openReceipt}
      </Button>
    </li>
  );
}
