import { IconTile } from '../../../common/data/IconTile';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/badge';
import type { ActivityModel } from '../../../../../adapters/presenters/employee-dashboard/employee-dashboard.view-models';

/** One line of the recent activities card. */
export function ActivityRow({ activity }: { activity: ActivityModel }) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-border px-5 py-2.25">
      <IconTile tone={activity.tone} size={30}>
        <i aria-hidden className={cn(activity.icon, 'text-15')} />
      </IconTile>
      <span className="shrink-0 whitespace-nowrap text-14 font-semibold text-foreground">
        {activity.title}
      </span>
      <span className="min-w-0 flex-1 truncate text-13 text-subtle">
        {activity.detail}
      </span>
      <Badge tone={activity.status.tone}>{activity.status.label}</Badge>
    </div>
  );
}
