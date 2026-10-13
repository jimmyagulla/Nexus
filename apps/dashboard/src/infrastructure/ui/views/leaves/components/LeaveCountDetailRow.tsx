import { cn } from '../../../lib/utils';

interface LeaveCountDetailRowProps {
  label: string;
  value: string;
  /** `total`: counted days, amber. `footer`: grey closing line. */
  variant?: 'default' | 'total' | 'footer';
}

export function LeaveCountDetailRow({
  label,
  value,
  variant = 'default',
}: LeaveCountDetailRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between px-4 py-2',
        variant === 'total' && 'border-t border-border',
        variant === 'footer' && 'rounded-b-lg bg-muted pb-2.5',
      )}
    >
      <span
        className={
          variant === 'total'
            ? 'font-semibold text-foreground'
            : 'text-muted-foreground'
        }
      >
        {label}
      </span>
      <span
        className={
          variant === 'total' ? 'font-bold text-amber-800' : 'font-semibold'
        }
      >
        {value}
      </span>
    </div>
  );
}
