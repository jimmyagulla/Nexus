import { AdornedInput } from '../../../common/forms/AdornedInput';

interface PeriodFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

/** "Du" / "Au" date box of the period filter. */
export function PeriodField({ label, placeholder, value, onValueChange }: PeriodFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-12 text-muted-foreground">{label}</span>
      <AdornedInput
        aria-label={label}
        placeholder={placeholder}
        inputMode="numeric"
        maxLength={10}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        containerClassName="h-9 px-2.5 focus-within:px-2.25"
        end={<i aria-hidden className="ri-calendar-line text-primary" />}
      />
    </div>
  );
}
