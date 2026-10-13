import { IconTile } from '../../../common/data/IconTile';

interface OvertimeHighlightCounterProps {
  label: string;
  value: string;
}

/** Purple-bordered main counter: hours awaiting approval. */
export function OvertimeHighlightCounter({ label, value }: OvertimeHighlightCounterProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-lg border-2 border-purple-200 bg-card px-4.5 py-3.5">
      <IconTile tone="purple" size={40} className="text-20">
        <i aria-hidden className="ri-time-line" />
      </IconTile>
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-purple-600">{label}</span>
        <span className="text-26 font-bold leading-8 text-heading">{value}</span>
      </div>
    </div>
  );
}
