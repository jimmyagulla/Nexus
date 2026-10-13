import { Link } from '@tanstack/react-router';
import { cn } from '../../../lib/utils';
import { Button } from '../../../shared/button';
import type { QuickActionModel } from '../../../../../adapters/presenters/employee-dashboard/employee-dashboard.view-models';

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
