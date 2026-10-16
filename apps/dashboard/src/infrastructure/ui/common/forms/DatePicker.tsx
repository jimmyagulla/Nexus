import { useState } from 'react';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';
import { Calendar } from '../../shared/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../shared/popover';

interface DatePickerProps {
  /** Calendar day `aaaa-mm-jj`, or '' when none is chosen. */
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  'aria-label'?: string;
  className?: string;
}

/** `aaaa-mm-jj` → local date at midnight. */
function toDate(value: string): Date | undefined {
  const [year, month, day] = value.split('-').map(Number);
  return value === '' ? undefined : new Date(year, month - 1, day);
}

/** Local date → `aaaa-mm-jj`. */
function toValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** `aaaa-mm-jj` → `jj/mm/aaaa`. */
function display(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

/** shadcn/ui date picker: a field opening a calendar in a popover. */
export function DatePicker({
  value,
  onValueChange,
  placeholder,
  'aria-label': ariaLabel,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  return (
    // Modal, so that the calendar stays clickable inside a modal sheet or dialog.
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-card px-2.5 text-14 focus-visible:border-2 focus-visible:border-ring focus-visible:px-2.25 focus-visible:outline-none data-[state=open]:border-2 data-[state=open]:border-ring data-[state=open]:px-2.25',
            className,
          )}
        >
          <span className={value === '' ? 'text-placeholder' : 'text-foreground'}>
            {value === '' ? placeholder : display(value)}
          </span>
          <i aria-hidden className="ri-calendar-line text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onValueChange(date === undefined ? '' : toValue(date));
            setOpen(false);
          }}
        />
        {value !== '' && (
          <div className="flex justify-end border-t border-border px-3 py-2">
            <button
              type="button"
              onClick={() => {
                onValueChange('');
                setOpen(false);
              }}
              className="text-13 font-semibold text-link hover:text-link-hover hover:underline"
            >
              {i18n.messages.common.clearDate}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
