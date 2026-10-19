interface PayslipDetailRowProps {
  label: string;
  value: string;
}

/** Label / value line of the payslip details panel. */
export function PayslipDetailRow({ label, value }: PayslipDetailRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
