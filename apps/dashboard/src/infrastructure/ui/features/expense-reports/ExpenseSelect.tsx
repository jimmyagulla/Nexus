import { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/select';

interface ExpenseSelectProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; icon?: string }[];
  placeholder?: string;
  'aria-invalid'?: boolean;
}

/** 36px select of the expense report form. */
export function ExpenseSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  'aria-invalid': invalid,
}: ExpenseSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        className="h-9 px-2.5 focus-visible:px-2.25 [&>i]:text-14"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <OptionLabel icon={option.icon}>{option.label}</OptionLabel>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function OptionLabel({ icon, children }: { icon?: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      {icon && <i aria-hidden className={`${icon} text-16 text-amber-800`} />}
      {children}
    </span>
  );
}
