import { Link } from '@tanstack/react-router';
import { IconTile } from '../../../common/data/IconTile';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import type { TaskItemModel } from '../../../../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';

/** Line of the "À traiter" list: flow tile, count, label, "Traiter". */
export function TaskItem({ task }: { task: TaskItemModel }) {
  return (
    <div className="flex items-center gap-3.5 border-b border-border px-5 py-3">
      <IconTile tone={task.tone} size={36}>
        <i aria-hidden className={`${task.icon} text-18`} />
      </IconTile>
      <span className="w-7 text-right text-22 font-bold text-heading">
        {task.count}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-14 font-semibold text-foreground">
          {task.label}
        </span>
        <span className="truncate text-12 text-subtle">{task.hint}</span>
      </div>
      <Button asChild variant="outline" size="xs">
        <Link to={task.to}>{i18n.messages.employerDashboard.process}</Link>
      </Button>
    </div>
  );
}
