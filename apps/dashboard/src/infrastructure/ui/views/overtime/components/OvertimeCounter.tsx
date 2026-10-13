interface OvertimeCounterProps {
  label: string;
  value: string;
}

/** Secondary counter card (approved, processed in payroll). */
export function OvertimeCounter({ label, value }: OvertimeCounterProps) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-border bg-card px-4.5 py-3.5">
      <span className="text-13 text-muted-foreground">{label}</span>
      <span className="text-22 font-bold text-heading">{value}</span>
    </div>
  );
}
