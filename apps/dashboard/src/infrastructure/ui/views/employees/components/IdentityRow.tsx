export interface IdentityRowModel {
  label: string;
  value: string;
}

/** "Label ...... value" line of the identity card. */
export function IdentityRow({ row }: { row: IdentityRowModel }) {
  return (
    <div className="flex justify-between gap-4 px-5 py-2 text-14">
      <span className="text-muted-foreground">{row.label}</span>
      <span className="text-right font-semibold text-foreground">{row.value}</span>
    </div>
  );
}
