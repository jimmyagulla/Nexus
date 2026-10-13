import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Badge } from '../../shared/badge';
import { Button } from '../../shared/button';
import { Card, CardHeader, CardTitle } from '../../shared/card';
import { ActivityItem, type ActivityItemModel } from './components/ActivityItem';
import { StatTile, type StatTileModel } from './components/StatTile';
import { TaskItem, type TaskItemModel } from './components/TaskItem';

export interface EmployerDashboardViewModel {
  greeting: string;
  summary: string;
  stats: StatTileModel[];
  taskCount: string;
  tasks: TaskItemModel[];
  activities: ActivityItemModel[];
}

/** P8.1 — employer dashboard: stats, tasks to process, recent activity. */
export function EmployerDashboard({
  model,
}: {
  model: EmployerDashboardViewModel;
}) {
  const labels = i18n.messages.employerDashboard;

  return (
    <PageContent className="gap-5 md:px-8 md:py-7">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-28 leading-9 font-bold text-heading">
            {model.greeting}
          </h1>
          <span className="whitespace-nowrap text-14 text-muted-foreground">
            {model.summary}
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <i aria-hidden className="ri-user-add-line" />
            {labels.addEmployee}
          </Button>
          <Button>
            <i aria-hidden className="ri-upload-cloud-2-line" />
            {labels.uploadDocuments}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {model.stats.map((stat) => (
          <StatTile key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start gap-5">
        <Card>
          <CardHeader>
            <CardTitle>{labels.toProcess}</CardTitle>
            <Badge tone="warning" size="sm" className="text-12 font-bold">
              {model.taskCount}
            </Badge>
          </CardHeader>
          {model.tasks.map((task) => (
            <TaskItem key={task.label} task={task} />
          ))}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.recentActivity}</CardTitle>
            <Link
              to={AppRoutes.activityLog}
              className="text-13 font-semibold text-link hover:text-link-hover hover:underline focus-visible:outline-none focus-visible:shadow-focus"
            >
              {labels.history}
            </Link>
          </CardHeader>
          {model.activities.map((activity) => (
            <ActivityItem
              key={`${activity.actor}-${activity.date}`}
              activity={activity}
            />
          ))}
        </Card>
      </div>
    </PageContent>
  );
}
