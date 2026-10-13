import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

interface ReviewActionsProps {
  requestable: boolean;
  decidable: boolean;
  reimbursable: boolean;
  onRequestInformation: () => void;
  onValidate: () => void;
  onRefuse: () => void;
  onReimburse: () => void;
}

export function ReviewActions({
  requestable,
  decidable,
  reimbursable,
  onRequestInformation,
  onValidate,
  onRefuse,
  onReimburse,
}: ReviewActionsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {requestable ? (
        <Button type="button" variant="outline" onClick={onRequestInformation}>
          {i18n.messages.expenseReports.requestInformation}
        </Button>
      ) : null}
      {decidable ? (
        <>
          <Button type="button" onClick={onValidate}>
            {i18n.messages.expenseReports.validate}
          </Button>
          <Button type="button" variant="outline" onClick={onRefuse}>
            {i18n.messages.expenseReports.refuse}
          </Button>
        </>
      ) : null}
      {reimbursable ? (
        <Button type="button" onClick={onReimburse}>
          {i18n.messages.expenseReports.reimburse}
        </Button>
      ) : null}
    </div>
  );
}
