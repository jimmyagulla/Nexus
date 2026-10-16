import { DatePicker } from '../../../common/forms/DatePicker';

interface PeriodFieldProps {
  label: string;
  placeholder: string;
  /** Calendar day `aaaa-mm-jj`, or ''. */
  value: string;
  onValueChange: (value: string) => void;
}

/** "Du" / "Au" date of the period filter. */
export function PeriodField({ label, placeholder, value, onValueChange }: PeriodFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-12 text-muted-foreground">{label}</span>
      <DatePicker
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}
