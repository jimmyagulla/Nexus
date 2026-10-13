/** Same layout as the expense panel labels (see ExpenseFieldLabel). */
interface RequestFieldLabelProps {
  text: string;
  required?: boolean;
  /** Grey mention after the label, e.g. "(optionnel)". */
  note?: string;
}

/**
 * Label text laid out like the mockup: the separating space belongs to the
 * label ("Date ", then "*"), which FormField's own marker does not reproduce.
 */
export function RequestFieldLabel({ text, required, note }: RequestFieldLabelProps) {
  return (
    <>
      {required || note ? `${text} ` : text}
      {required && <span className="text-red-500">*</span>}
      {note && <span className="font-normal text-subtle">{note}</span>}
    </>
  );
}
