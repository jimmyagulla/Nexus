import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

interface ReviewActionsProps {
  requestable: boolean;
  decidable: boolean;
  onRequestInformation: () => void;
  onValidate: () => void;
  onRefuse: () => void;
}

export function ReviewActions({
  requestable,
  decidable,
  onRequestInformation,
  onValidate,
  onRefuse,
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
    </div>
  );
}
