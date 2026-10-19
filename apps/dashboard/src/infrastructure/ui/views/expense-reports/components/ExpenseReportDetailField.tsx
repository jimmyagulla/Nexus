import type { ExpenseReportDetailFieldModel } from '../../../../../adapters/presenters/expense-reports/expense-report-detail.presenter';

/** One "label / value" pair of the detail of a report. */
export function ExpenseReportDetailField({ model }: { model: ExpenseReportDetailFieldModel }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-12 text-muted-foreground">{model.label}</dt>
      <dd className="text-14 font-semibold text-foreground">{model.value}</dd>
    </div>
  );
}
