import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Button } from '../../../shared/button';
import { Card } from '../../../shared/card';

interface ExpenseReportTotalsProps {
  total: string;
  summary: string;
}

/** Total to refund and the note's save / submit actions. */
export function ExpenseReportTotals({ total, summary }: ExpenseReportTotalsProps) {
  const labels = i18n.messages.expenseReports.report;

  return (
    <Card className="flex items-center gap-6 px-5 py-4.5">
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-13 text-muted-foreground">{labels.totalToRefund}</span>
        <span className="text-28 font-bold text-heading">{total}</span>
        <span className="text-12 text-subtle">{summary}</span>
      </div>
      <Button variant="outline" size="lg" className="px-4">
        {labels.saveDraft}
      </Button>
      <Button asChild size="lg">
        <Link to={AppRoutes.expenseReportSubmitted}>
          <i aria-hidden className="ri-send-plane-line" />
          {labels.submit}
        </Link>
      </Button>
    </Card>
  );
}
