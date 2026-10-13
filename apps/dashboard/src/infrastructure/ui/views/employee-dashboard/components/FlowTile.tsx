import { Link } from '@tanstack/react-router';
import { IconTile } from '../../../common/data/IconTile';
import { cn } from '../../../lib/utils';
import type { FlowTileModel } from '../../../../../adapters/presenters/employee-dashboard/employee-dashboard.view-models';

/** One cell of the flows grid: icon, flow name, its status and a link. */
export function FlowTile({ tile }: { tile: FlowTileModel }) {
  return (
    <Link
      {...tile.link}
      className="flex min-w-0 items-center gap-3 border-b border-r border-border px-4.5 py-3 outline-none transition-colors hover:bg-blue-25 focus-visible:shadow-focus"
    >
      <IconTile tone={tile.tone} size={36}>
        <i aria-hidden className={cn(tile.icon, 'text-18')} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-12 text-muted-foreground">{tile.label}</span>
        <span className="truncate text-15 font-bold text-heading">{tile.value}</span>
      </div>
      <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-13 font-semibold text-link">
        <span>{tile.action}</span>
        <i aria-hidden className="ri-arrow-right-s-line" />
      </span>
    </Link>
  );
}
