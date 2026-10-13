import { cn } from '../../../lib/utils';
import type { LeaveCalendarLegendTone } from '../../../../../adapters/presenters/leaves/leaves.view-models';

interface LeaveCalendarLegendItemProps {
  label: string;
  tone: LeaveCalendarLegendTone;
}

const swatchClassName: Record<LeaveCalendarLegendTone, string> = {
  accepted: 'border-green-300 bg-green-100',
  pending: 'border-amber-300 bg-amber-50',
  today: 'border-link',
  weekend: 'border-border bg-muted',
};

export function LeaveCalendarLegendItem({ label, tone }: LeaveCalendarLegendItemProps) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={cn('box-content size-2.5 rounded-3 border', swatchClassName[tone])}
      />
      {label}
    </span>
  );
}
