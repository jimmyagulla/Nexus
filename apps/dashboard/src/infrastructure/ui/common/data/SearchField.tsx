import { cn } from '../../lib/utils';

interface SearchFieldProps {
  placeholder: string;
  defaultValue?: string;
  className?: string;
}

/** 36px search box of the list toolbars. */
export function SearchField({
  placeholder,
  defaultValue,
  className,
}: SearchFieldProps) {
  return (
    <label
      className={cn(
        'flex h-9 w-75 items-center gap-2 rounded-sm border border-input bg-card px-3 focus-within:border-2 focus-within:border-ring focus-within:px-2.75',
        className,
      )}
    >
      <i aria-hidden className="ri-search-line text-16 shrink-0 text-subtle" />
      <input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="min-w-0 flex-1 bg-transparent text-14 text-foreground outline-none placeholder:text-placeholder"
      />
    </label>
  );
}
