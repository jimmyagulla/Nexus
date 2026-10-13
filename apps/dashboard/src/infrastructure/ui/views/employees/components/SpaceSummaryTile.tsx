import { Card } from '../../../shared/card';

export interface SpaceSummaryTileModel {
  icon: string;
  label: string;
  value: string;
  hint: string;
}

/** Summary figure of an employee space (documents, payslips…). */
export function SpaceSummaryTile({ tile }: { tile: SpaceSummaryTileModel }) {
  return (
    <Card className="flex flex-col gap-2 px-4.5 py-4">
      <div className="flex items-center gap-2 text-14 font-semibold text-foreground">
        <i aria-hidden className={`${tile.icon} text-18 text-primary`} />
        <span>{tile.label}</span>
      </div>
      <span className="text-24 font-bold text-heading">{tile.value}</span>
      <span className="text-12 text-subtle">{tile.hint}</span>
    </Card>
  );
}
