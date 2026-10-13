import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { SubmissionError } from '../common/errors/SubmissionError';
import { Button } from '../shared/button';
import { i18n } from '../i18n/i18n';

interface ExchangeDetailProps {
  exchange: CabinetExchangeViewModel;
  downloadError: string | null;
  onDownload: () => void;
  onBack: () => void;
}

export function ExchangeDetail({
  exchange,
  downloadError,
  onDownload,
  onBack,
}: ExchangeDetailProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{exchange.category}</h1>
      <p>{exchange.fileName}</p>
      <p>{exchange.direction}</p>
      <p>{exchange.status}</p>
      <p>{exchange.date}</p>
      <p>
        {exchange.consultedOn === null
          ? i18n.messages.cabinet.notConsulted
          : `${i18n.messages.cabinet.consultedOn} ${exchange.consultedOn}`}
      </p>
      <SubmissionError message={downloadError} />
      <div className="flex gap-4">
        <Button type="button" onClick={onDownload}>
          {i18n.messages.cabinet.download}
        </Button>
        <Button type="button" variant="outline" onClick={onBack}>
          {i18n.messages.cabinet.back}
        </Button>
      </div>
    </div>
  );
}
