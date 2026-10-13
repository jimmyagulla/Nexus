import { i18n } from '../../../i18n/i18n';

export interface OvertimeCounterPanelModel {
  pending: string;
  thisDeclaration: string;
  pendingAfter: string;
}

/** "Mon compteur" box: pending hours before and after this declaration. */
export function OvertimeCounterPanel({
  pending,
  thisDeclaration,
  pendingAfter,
}: OvertimeCounterPanelModel) {
  const labels = i18n.messages.overtime.declaration;

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border p-4 text-14">
      <span className="font-bold text-heading">{labels.counterTitle}</span>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{labels.pending}</span>
        <span className="font-semibold">{pending}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{labels.thisDeclaration}</span>
        <span className="font-bold text-purple-600">{thisDeclaration}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2.5">
        <span className="text-muted-foreground">{labels.pendingAfter}</span>
        <span className="text-18 font-bold text-heading">{pendingAfter}</span>
      </div>
    </div>
  );
}
