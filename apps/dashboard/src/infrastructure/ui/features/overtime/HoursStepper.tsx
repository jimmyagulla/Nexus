import { i18n } from '../../i18n/i18n';

interface HoursStepperProps {
  id?: string;
  defaultValue: string;
}

/** 40px "− 2 h 30 +" field: duration with half-hour steps on each side. */
export function HoursStepper({ id, defaultValue }: HoursStepperProps) {
  const labels = i18n.messages.overtime.declaration;

  return (
    <div className="flex h-10 items-center rounded-sm border border-input bg-card text-14 focus-within:shadow-focus">
      <button
        type="button"
        aria-label={labels.decrease}
        className="flex h-9.5 w-10 items-center justify-center border-r border-border text-primary hover:bg-accent focus-visible:outline-none"
      >
        <i aria-hidden className="ri-subtract-line" />
      </button>
      <input
        id={id}
        defaultValue={defaultValue}
        className="min-w-0 flex-1 bg-transparent text-center font-bold outline-none"
      />
      <button
        type="button"
        aria-label={labels.increase}
        className="flex h-9.5 w-10 items-center justify-center border-l border-border text-primary hover:bg-accent focus-visible:outline-none"
      >
        <i aria-hidden className="ri-add-line" />
      </button>
    </div>
  );
}
