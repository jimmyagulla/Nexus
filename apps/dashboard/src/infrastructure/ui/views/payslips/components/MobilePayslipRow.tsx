import { i18n } from '../../../i18n/i18n';
import { Badge } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import type { PayslipRowModel } from '../../../../../adapters/presenters/payslips/payslip-row.presenter';

interface MobilePayslipRowProps {
  payslip: PayslipRowModel;
  onView: (payslipId: string) => void;
  onDownload: (payslipId: string) => void;
}

/** One payslip card of the mobile list (M.2): its period opens it, the button saves it. */
export function MobilePayslipRow({ payslip, onView, onDownload }: MobilePayslipRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3">
      <i aria-hidden className="ri-file-paper-2-line text-22 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <button
          type="button"
          onClick={() => onView(payslip.id)}
          className="text-left text-15 font-bold text-heading outline-none focus-visible:shadow-focus"
        >
          {payslip.period}
        </button>
        <span>
          <Badge size="xs" tone={payslip.status.tone}>
            {payslip.status.label}
          </Badge>
        </span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        aria-label={i18n.messages.common.download}
        className="size-11 text-20"
        onClick={() => onDownload(payslip.id)}
      >
        <i aria-hidden className="ri-download-2-line" />
      </Button>
    </div>
  );
}
