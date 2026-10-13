import { cn } from '../../../lib/utils';

export type LeaveCalendarDayState =
  | 'outside'
  | 'workday'
  | 'weekend'
  | 'accepted'
  | 'pending';

export interface LeaveCalendarDayModel {
  /** Day number; empty for the padding cells before the 1st. */
  label: string;
  state: LeaveCalendarDayState;
  today?: boolean;
}

const stateClassName: Record<LeaveCalendarDayState, string> = {
  outside: 'border-transparent text-transparent',
  workday: 'border-border bg-card text-foreground',
  weekend: 'border-border bg-muted text-disabled',
  accepted: 'border-green-300 bg-green-100 text-green-700',
  pending: 'border-amber-300 bg-amber-50 text-amber-800',
};

/** One 40px cell of the month calendar. */
export function LeaveCalendarDay({ label, state, today }: LeaveCalendarDayModel) {
  return (
    <span
      aria-hidden={state === 'outside' || undefined}
      aria-current={today ? 'date' : undefined}
      className={cn(
        'flex h-10 items-center justify-center rounded-md border text-13 font-semibold',
        stateClassName[state],
        today && 'border-link',
      )}
    >
      <span>{label}</span>
    </span>
  );
}
