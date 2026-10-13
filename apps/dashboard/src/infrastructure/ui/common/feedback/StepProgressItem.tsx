import { cn } from '../../lib/utils';

export type StepState = 'done' | 'current' | 'upcoming';

interface StepProgressItemProps {
  label: string;
  state: StepState;
}

const barClassName: Record<StepState, string> = {
  done: 'bg-green-500',
  current: 'bg-amber-500',
  upcoming: 'bg-grey-200',
};

const labelClassName: Record<StepState, string> = {
  done: 'font-bold text-green-700',
  current: 'font-bold text-amber-800',
  upcoming: 'text-subtle',
};

export function StepProgressItem({ label, state }: StepProgressItemProps) {
  return (
    <li className="flex flex-col gap-1.5">
      <span className={cn('h-1 rounded-xs', barClassName[state])} />
      <span className={labelClassName[state]}>{label}</span>
    </li>
  );
}
