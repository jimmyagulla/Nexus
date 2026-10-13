import { Card } from '../../../shared/card';
import type { StatTileModel } from '../../../../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';

/** Figure of the employer stats strip: big number, label, hint. */
export function StatTile({ stat }: { stat: StatTileModel }) {
  return (
    <Card className="flex items-center gap-3.5 px-4.5 py-3.5">
      <span className="text-26 font-bold text-heading">{stat.value}</span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-13 font-semibold text-foreground">
          {stat.label}
        </span>
        <span className="truncate text-12 text-subtle">{stat.hint}</span>
      </div>
    </Card>
  );
}
