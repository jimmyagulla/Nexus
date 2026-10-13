import { Link } from '@tanstack/react-router';
import { ConfirmationCard } from '../../common/feedback/ConfirmationCard';
import { StepProgress } from '../../common/feedback/StepProgress';
import { SummaryList } from '../../common/feedback/SummaryList';
import { SummaryRow } from '../../common/feedback/SummaryRow';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Badge } from '../../shared/badge';
import { Button } from '../../shared/button';
import type { LeaveRequestSentViewModel } from '../../../../adapters/presenters/leaves/leaves.view-models';

interface LeaveRequestSentProps {
  model: LeaveRequestSentViewModel;
}

/** P4.3 — confirmation once a leave request is sent to HR. */
export function LeaveRequestSent({ model }: LeaveRequestSentProps) {
  const labels = i18n.messages.leaves.sent;

  return (
    <ConfirmationCard
      title={labels.title}
      description={model.description}
      actions={
        <>
          <Button asChild size="lg" className="flex-1">
            <Link to={AppRoutes.leaves}>{labels.seeRequests}</Link>
          </Button>
          <Button size="lg" variant="outline-destructive" className="flex-1">
            {labels.cancelRequest}
          </Button>
        </>
      }
    >
      <SummaryList>
        <SummaryRow label={labels.type} value={model.type} />
        <SummaryRow label={labels.period} value={model.period} />
        <SummaryRow label={labels.deducted} value={model.deducted} />
        <SummaryRow label={labels.sentAt} value={model.sentAt} />
        <SummaryRow
          label={i18n.messages.common.status}
          value={<Badge tone={model.status.tone}>{model.status.label}</Badge>}
        />
      </SummaryList>
      <StepProgress steps={model.steps} />
    </ConfirmationCard>
  );
}
