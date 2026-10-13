import { IconTile } from '../../../common/data/IconTile';

interface LeaveBalanceHighlightProps {
  label: string;
  value: string;
}

/** Green-bordered main counter: paid leave still available. */
export function LeaveBalanceHighlight({ label, value }: LeaveBalanceHighlightProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-lg border-2 border-green-300 bg-card px-4.5 py-3.5">
      <IconTile tone="green" size={40} className="text-20">
        <i aria-hidden className="ri-sun-line" />
      </IconTile>
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-green-700">{label}</span>
        <span className="text-26 font-bold leading-8 text-heading">{value}</span>
      </div>
    </div>
  );
}
