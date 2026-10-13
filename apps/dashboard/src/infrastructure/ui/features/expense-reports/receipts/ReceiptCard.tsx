import type { ReceiptViewModel } from '../../../../../adapters/presenters/expense-report.presenter';

interface ReceiptCardProps {
  receipt: ReceiptViewModel;
}

export function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <li className="flex items-center gap-4 py-1">
      <span>{receipt.fileName}</span>
      <span className="text-muted-foreground">{receipt.size}</span>
    </li>
  );
}
