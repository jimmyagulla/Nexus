import { Button } from '../shared/button';
import { i18n } from '../i18n/i18n';

interface ReceivedDocumentsEmptyProps {
  onDeposit: () => void;
}

export function ReceivedDocumentsEmpty({
  onDeposit,
}: ReceivedDocumentsEmptyProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {i18n.messages.cabinet.receivedTitle}
      </h1>
      <p className="text-sm text-muted-foreground">
        {i18n.messages.cabinet.emptyList}
      </p>
      <Button type="button" onClick={onDeposit}>
        {i18n.messages.cabinet.depositAction}
      </Button>
    </div>
  );
}
