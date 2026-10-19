import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';

/** Opens the form of a new expense report. */
export function NewExpenseReportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <i aria-hidden className="ri-add-line text-18" />
      {i18n.messages.expenseReports.list.newReport}
    </Button>
  );
}
