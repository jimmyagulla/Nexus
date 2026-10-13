import { cn } from '../../../lib/utils';

interface LeaveCounterProps {
  label: string;
  value: string;
  /** `pending` shows the value in amber. */
  tone?: 'default' | 'pending';
}

/** Secondary counter card of the leave balance row (acquired, taken, pending). */
export function LeaveCounter({ label, value, tone = 'default' }: LeaveCounterProps) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-border bg-card px-4.5 py-3.5">
      <span className="text-13 text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-22 font-bold',
          tone === 'pending' ? 'text-amber-800' : 'text-heading',
        )}
      >
        {value}
      </span>
    </div>
  );
}
