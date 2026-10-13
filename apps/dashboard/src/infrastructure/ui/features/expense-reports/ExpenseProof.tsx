interface ExpenseProofProps {
  name: string;
  /** "214 Ko · Importé" */
  details: string;
}

/** Receipt already imported in the expense panel. */
export function ExpenseProof({ name, details }: ExpenseProofProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2">
      <i aria-hidden className="ri-file-pdf-2-line text-20 text-primary" />
      <div className="flex flex-1 flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-12 text-subtle">{details}</span>
      </div>
      <i aria-hidden className="ri-checkbox-circle-fill text-18 text-green-500" />
    </div>
  );
}
