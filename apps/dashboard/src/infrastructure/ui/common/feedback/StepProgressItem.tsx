import type { ProgressStepState } from '../../../../adapters/presenters/display.types';
import { cn } from '../../lib/utils';

interface StepProgressItemProps {
  label: string;
  state: ProgressStepState;
}

const barClassName: Record<ProgressStepState, string> = {
  done: 'bg-green-500',
  current: 'bg-amber-500',
  upcoming: 'bg-grey-200',
};

const labelClassName: Record<ProgressStepState, string> = {
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
