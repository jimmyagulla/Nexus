import { CSSProperties } from 'react';
import { i18n } from '../../../i18n/i18n';

const stripes: CSSProperties = {
  background:
    'repeating-linear-gradient(135deg, var(--color-white) 0px, var(--color-white) 12px, var(--color-grey-50) 12px, var(--color-grey-50) 24px)',
};

/** Placeholder sheet standing for the PDF rendering of the payslip. */
export function PayslipPreview() {
  return (
    <div
      className="box-content flex h-full w-110 items-center justify-center border border-border shadow-popover-soft"
      style={stripes}
    >
      <span className="rounded-sm border border-border bg-card px-2.5 py-1.5 font-mono text-12 font-medium leading-snug text-subtle">
        {i18n.messages.payslips.detail.preview}
      </span>
    </div>
  );
}
