import { cn } from '../../../lib/utils';

export type LeaveBalanceKind = 'acquired' | 'taken' | 'pending' | 'remaining';

export interface LeaveBalanceItemModel {
  kind: LeaveBalanceKind;
  label: string;
  value: string;
}

const dotClassName: Record<LeaveBalanceKind, string> = {
  acquired: 'bg-grey-300',
  taken: 'bg-blue-700',
  pending: 'bg-amber-500',
  remaining: 'bg-green-500',
};

const valueClassName: Record<LeaveBalanceKind, string> = {
  acquired: 'text-heading',
  taken: 'text-heading',
  pending: 'text-amber-800',
  remaining: 'text-green-700',
};

/** One figure of the leave balance, with the colour dot of its ring arc. */
export function LeaveBalanceItem({ item }: { item: LeaveBalanceItemModel }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 whitespace-nowrap text-12 text-muted-foreground">
        <span
          className={cn('size-2 shrink-0 rounded-full', dotClassName[item.kind])}
        />
        {item.label}
      </span>
      <span
        className={cn(
          'whitespace-nowrap text-16 font-bold',
          valueClassName[item.kind],
        )}
      >
        {item.value}
      </span>
    </div>
  );
}
