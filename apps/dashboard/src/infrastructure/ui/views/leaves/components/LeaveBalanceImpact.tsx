import { i18n } from '../../../i18n/i18n';

export interface LeaveBalanceImpactModel {
  available: string;
  /** "− 2 j" */
  deducted: string;
  balanceAfter: string;
  /** Share of the acquired days left after approval, in %. */
  remainingPercent: number;
  /** Share of the acquired days this request deducts, in %. */
  deductedPercent: number;
}

/** "Impact sur votre compteur" box with its two-segment balance bar. */
export function LeaveBalanceImpact({
  available,
  deducted,
  balanceAfter,
  remainingPercent,
  deductedPercent,
}: LeaveBalanceImpactModel) {
  const labels = i18n.messages.leaves.request;

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border p-4 text-14">
      <span className="font-bold text-heading">{labels.impactTitle}</span>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{labels.available}</span>
        <span className="font-semibold">{available}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{labels.deducted}</span>
        <span className="font-bold text-amber-800">{deducted}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2.5">
        <span className="text-muted-foreground">{labels.balanceAfter}</span>
        <span className="text-18 font-bold text-green-700">{balanceAfter}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-sm bg-grey-100">
        <span className="bg-green-500" style={{ width: `${remainingPercent}%` }} />
        <span className="bg-amber-500" style={{ width: `${deductedPercent}%` }} />
      </div>
    </div>
  );
}
