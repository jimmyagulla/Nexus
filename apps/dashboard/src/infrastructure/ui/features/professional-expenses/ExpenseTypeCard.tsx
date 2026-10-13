import { cn } from '../../lib/utils';
import { RadioGroupItem } from '../../shared/radio-group';

export interface ExpenseTypeOption {
  value: string;
  label: string;
  description: string;
  /** Remix Icon class, e.g. `ri-home-wifi-line`. */
  icon: string;
}

/** Radio card of the "Type de frais" choice. */
export function ExpenseTypeCard({ option }: { option: ExpenseTypeOption }) {
  const id = `expense-type-${option.value}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer flex-col gap-1 rounded-lg border border-grey-300 bg-card px-3 py-2.5 transition-colors hover:border-orange-700',
        'has-data-[state=checked]:border-2 has-data-[state=checked]:border-orange-700 has-data-[state=checked]:bg-orange-50',
      )}
    >
      <div className="flex justify-between">
        <i aria-hidden className={cn(option.icon, 'text-20 text-orange-700')} />
        <RadioGroupItem
          id={id}
          value={option.value}
          className="data-[state=checked]:text-orange-700"
        />
      </div>
      <span className="text-13 font-bold text-heading">{option.label}</span>
      <span className="text-12 text-muted-foreground">{option.description}</span>
    </label>
  );
}
