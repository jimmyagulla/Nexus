import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface FormFieldProps {
  label: ReactNode;
  htmlFor?: string;
  /** Id of the label, for a control that names itself with `aria-labelledby`. */
  labelId?: string;
  required?: boolean;
  /** Shows the grey "(optionnel)" mention. */
  optional?: boolean;
  /** Any other grey mention after the label, e.g. "(si applicable)". */
  note?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

/**
 * Any control under its label: bold label (with red `*` or a grey mention),
 * the control given as children, an optional hint.
 */
export function FormField({
  label,
  htmlFor,
  labelId,
  required,
  optional,
  note,
  hint,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  const mention = optional ? i18n.messages.common.optional : note;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        id={labelId}
        htmlFor={htmlFor}
        className={cn('text-14 font-bold text-foreground', labelClassName)}
      >
        {/* The space belongs to the label text, as in the mockup ("Date ", "*"). */}
        {typeof label === 'string' && (required || mention) ? `${label} ` : label}
        {required && <span className="text-red-500">*</span>}
        {mention && <span className="font-normal text-subtle">{mention}</span>}
      </label>
      {children}
      {hint && <span className="text-12 text-subtle">{hint}</span>}
    </div>
  );
}
