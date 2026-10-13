import { Link } from '@tanstack/react-router';
import { ConfirmationCard } from '../../common/feedback/ConfirmationCard';
import { StepProgress } from '../../common/feedback/StepProgress';
import { SummaryList } from '../../common/feedback/SummaryList';
import { SummaryRow } from '../../common/feedback/SummaryRow';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Badge } from '../../shared/badge';
import { Button } from '../../shared/button';
import type { DocumentSentViewModel } from '../../../../adapters/presenters/documents/documents.view-models';

interface DocumentSentProps {
  model: DocumentSentViewModel;
}

/** P2.3 — confirmation once a document is sent to HR. */
export function DocumentSent({ model }: DocumentSentProps) {
  const labels = i18n.messages.documents.sent;

  return (
    <ConfirmationCard
      title={labels.title}
      description={model.description}
      actions={
        <>
          <Button asChild size="lg" className="flex-1">
            <Link to={AppRoutes.documents}>{labels.seeDocuments}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <Link to={AppRoutes.home}>{labels.backHome}</Link>
          </Button>
        </>
      }
    >
      <SummaryList>
        <SummaryRow label={labels.type} value={model.type} />
        <SummaryRow label={labels.file} value={model.fileName} />
        <SummaryRow label={labels.sentAt} value={model.sentAt} />
        <SummaryRow label={labels.recipient} value={model.recipient} />
        <SummaryRow
          label={i18n.messages.common.status}
          value={<Badge tone={model.status.tone}>{model.status.label}</Badge>}
        />
      </SummaryList>
      <StepProgress steps={model.steps} />
    </ConfirmationCard>
  );
}
