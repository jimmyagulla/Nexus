import { Link, type LinkOptions } from '@tanstack/react-router';
import { cn } from '../../../lib/utils';
import { Button } from '../../../shared/button';

export interface QuickActionModel {
  id: string;
  /** Remix Icon class, e.g. `ri-time-line`. */
  icon: string;
  label: string;
  link: LinkOptions;
  primary?: boolean;
}

/** Full-width action button of the quick actions card. */
export function QuickAction({ action }: { action: QuickActionModel }) {
  return (
    <Button
      asChild
      variant={action.primary ? 'default' : 'outline'}
      className="min-w-0 justify-start gap-2.5 border border-primary px-3"
    >
      <Link {...action.link}>
        <i aria-hidden className={cn(action.icon, 'shrink-0 text-18')} />
        <span className="flex-1 truncate">{action.label}</span>
        <i aria-hidden className="ri-arrow-right-line shrink-0" />
      </Link>
    </Button>
  );
}
