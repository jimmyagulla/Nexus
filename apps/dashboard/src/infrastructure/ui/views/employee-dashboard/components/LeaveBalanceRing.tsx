import { CSSProperties } from 'react';
import { i18n } from '../../../i18n/i18n';
import type { LeaveBalanceRingModel } from '../../../../../adapters/presenters/employee-dashboard/employee-dashboard.presenter';

interface LeaveBalanceRingProps {
  ring: LeaveBalanceRingModel;
  available: string;
}

/** 112px donut of the leave balance with the available days in its centre. */
export function LeaveBalanceRing({ ring, available }: LeaveBalanceRingProps) {
  const style: CSSProperties = {
    background: `conic-gradient(var(--color-blue-700) 0deg, var(--color-blue-700) ${ring.takenUntil}%, var(--color-amber-500) ${ring.takenUntil}%, var(--color-amber-500) ${ring.pendingUntil}%, var(--color-green-500) ${ring.pendingUntil}%, var(--color-green-500) 100%)`,
  };

  return (
    <div
      className="flex size-28 shrink-0 items-center justify-center rounded-full"
      style={style}
    >
      <div className="flex size-21 flex-col items-center justify-center rounded-full bg-card">
        <span className="whitespace-nowrap text-24 font-bold leading-7 text-heading">
          {available}
        </span>
        <span className="whitespace-nowrap text-11 text-muted-foreground">
          {i18n.messages.employeeDashboard.leaves.available}
        </span>
      </div>
    </div>
  );
}
