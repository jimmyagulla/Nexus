import type { ActivityItemModel } from '../../../../../adapters/presenters/employer-dashboard/employer-dashboard.presenter';

/** Line of the recent activity feed: icon, "<b>Actor</b> action", date. */
export function ActivityItem({ activity }: { activity: ActivityItemModel }) {
  return (
    <div className="flex gap-3 border-b border-border px-5 py-3">
      <i
        aria-hidden
        className={`${activity.icon} text-18 leading-5 text-subtle`}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-14 leading-5">
        <span className="truncate text-foreground">
          <b className="font-bold">{activity.actor}</b> {activity.action}
        </span>
        <span className="text-12 text-subtle">{activity.date}</span>
      </div>
    </div>
  );
}
