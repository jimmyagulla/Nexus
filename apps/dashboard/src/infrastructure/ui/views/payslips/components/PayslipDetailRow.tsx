import { cn } from '../../../lib/utils';

interface PayslipDetailRowProps {
  label: string;
  value: string;
  /** Net pay line: top separator and a 16px bold value. */
  total?: boolean;
}

/** Label / value line of the payslip details panel. */
export function PayslipDetailRow({ label, value, total }: PayslipDetailRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between',
        total && 'border-t border-border pt-2.5',
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          'font-semibold',
          total && 'text-16 font-bold text-heading',
        )}
      >
        {value}
      </span>
    </div>
  );
}
