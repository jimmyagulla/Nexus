import { StepProgressItem, type StepState } from './StepProgressItem';

export interface Step {
  label: string;
  state: StepState;
}

interface StepProgressProps {
  steps: Step[];
}

/** Three-bar progress of a request: done (green), current (amber), upcoming (grey). */
export function StepProgress({ steps }: StepProgressProps) {
  return (
    <ol className="grid grid-cols-3 gap-2 text-12 leading-4">
      {steps.map((step) => (
        <StepProgressItem key={step.label} label={step.label} state={step.state} />
      ))}
    </ol>
  );
}
