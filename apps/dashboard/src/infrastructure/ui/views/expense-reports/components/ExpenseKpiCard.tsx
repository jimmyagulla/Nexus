import { IconTile } from '../../../common/data/IconTile';
import { Card } from '../../../shared/card';
import type { ExpenseKpiModel } from '../../../../../adapters/presenters/expense-reports/expense-reports.presenter';

/** Key figure card of the expense reports list. */
export function ExpenseKpiCard({ kpi }: { kpi: ExpenseKpiModel }) {
  const figure = (
    <div className="flex flex-col">
      <span className="text-13 text-muted-foreground">{kpi.label}</span>
      <span className="text-22 font-bold text-heading">{kpi.value}</span>
    </div>
  );

  if (!kpi.icon) {
    return (
      <Card className="flex flex-col justify-center px-4.5 py-3.5">{figure}</Card>
    );
  }

  return (
    <Card className="flex items-center gap-3.5 px-4.5 py-3.5">
      <IconTile tone="amber" size={40} className="text-20">
        <i aria-hidden className={kpi.icon} />
      </IconTile>
      {figure}
    </Card>
  );
}
