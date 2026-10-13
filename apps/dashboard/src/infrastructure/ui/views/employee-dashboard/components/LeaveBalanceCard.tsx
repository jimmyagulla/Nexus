import { Link } from '@tanstack/react-router';
import { IconTile } from '../../../common/data/IconTile';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Badge, type BadgeProps } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { Card } from '../../../shared/card';
import { LeaveBalanceItem, type LeaveBalanceItemModel } from './LeaveBalanceItem';
import { LeaveBalanceRing, type LeaveBalanceRingModel } from './LeaveBalanceRing';

export interface LeaveBalanceModel {
  available: string;
  period: string;
  ring: LeaveBalanceRingModel;
  items: LeaveBalanceItemModel[];
  nextLeave: { dates: string; status: { label: string; tone: BadgeProps['tone'] } };
}

/** Paid-leave balance: ring, figures, next leave and leave actions. */
export function LeaveBalanceCard({ balance }: { balance: LeaveBalanceModel }) {
  const labels = i18n.messages.employeeDashboard.leaves;

  return (
    <Card className="flex flex-wrap items-center gap-7 px-6 py-5">
      <LeaveBalanceRing ring={balance.ring} available={balance.available} />
      <div className="flex min-w-80 flex-1 flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <IconTile tone="green" size={28}>
            <i aria-hidden className="ri-sun-line text-16" />
          </IconTile>
          <h2 className="whitespace-nowrap text-16 font-bold text-heading">
            {labels.title}
          </h2>
          <span className="whitespace-nowrap text-13 text-muted-foreground">
            {`${labels.period} ${balance.period}`}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5">
          {balance.items.map((item) => (
            <LeaveBalanceItem key={item.kind} item={item} />
          ))}
        </div>
        <span className="flex items-center gap-2 whitespace-nowrap text-13 text-body">
          <i aria-hidden className="ri-calendar-event-line text-primary" />
          {`${labels.nextLeave} ${balance.nextLeave.dates}`}
          <Badge size="xs" tone={balance.nextLeave.status.tone}>
            {balance.nextLeave.status.label}
          </Badge>
        </span>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <Button asChild className="justify-start">
          <Link to={AppRoutes.leaveRequest}>
            <i aria-hidden className="ri-add-line" />
            {labels.request}
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start">
          <Link to={AppRoutes.leaves}>
            <i aria-hidden className="ri-calendar-2-line" />
            {labels.calendar}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
