import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface FormFieldProps {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

/** Bold label (with red `*` or grey "(optionnel)"), the control, an optional hint. */
export function FormField({
  label,
  htmlFor,
  required,
  optional,
  hint,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className={cn('text-14 font-bold text-foreground', labelClassName)}
      >
        {/* The space belongs to the label text, as in the mockup ("Date ", "*"). */}
        {typeof label === 'string' && (required || optional) ? `${label} ` : label}
        {required && <span className="text-red-500">*</span>}
        {optional && (
          <span className="font-normal text-subtle">
            {i18n.messages.common.optional}
          </span>
        )}
      </label>
      {children}
      {hint && <span className="text-12 text-subtle">{hint}</span>}
    </div>
  );
}
