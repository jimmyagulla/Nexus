import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/select';

interface ExpenseSelectProps {
  id: string;
  defaultValue: string;
  options: string[];
}

/** 36px select of the expense panel. */
export function ExpenseSelect({ id, defaultValue, options }: ExpenseSelectProps) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger
        id={id}
        className="h-9 px-2.5 focus-visible:px-2.25 [&>i]:text-14"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
