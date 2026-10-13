import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AdornedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Trailing element, e.g. a calendar icon or a "€" unit. */
  end?: ReactNode;
  /** Leading element, e.g. a search icon. */
  start?: ReactNode;
  containerClassName?: string;
}

/** 40px input box with a leading and/or trailing adornment. */
export function AdornedInput({
  end,
  start,
  className,
  containerClassName,
  ...props
}: AdornedInputProps) {
  return (
    <label
      className={cn(
        'flex h-10 items-center justify-between gap-2 rounded-sm border border-input bg-card px-3 text-14 text-foreground focus-within:border-2 focus-within:border-ring focus-within:px-2.75',
        containerClassName,
      )}
    >
      {start}
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent outline-none placeholder:text-placeholder',
          className,
        )}
        {...props}
      />
      {end}
    </label>
  );
}
