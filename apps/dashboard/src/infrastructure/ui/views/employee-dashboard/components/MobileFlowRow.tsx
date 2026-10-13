import { Link } from '@tanstack/react-router';
import { IconTile } from '../../../common/data/IconTile';
import { cn } from '../../../lib/utils';
import type { MobileFlowRowModel } from '../../../../../adapters/presenters/employee-dashboard/employee-dashboard.view-models';

/** One flow card of the mobile home (M.1). */
export function MobileFlowRow({ row }: { row: MobileFlowRowModel }) {
  return (
    <Link
      {...row.link}
      className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 outline-none focus-visible:shadow-focus"
    >
      <IconTile tone="blue" size={36}>
        <i aria-hidden className={cn(row.icon, 'text-18')} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-15 font-bold text-heading">{row.title}</span>
        <span className="text-12 text-muted-foreground">{row.detail}</span>
      </div>
      <i aria-hidden className="ri-arrow-right-s-line text-20 text-disabled" />
    </Link>
  );
}
