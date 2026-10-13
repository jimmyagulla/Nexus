import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { cn } from '../../../lib/utils';
import { AppRoutes } from '../../../routes/app-routes';
import { Badge } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { TableCell, TableRow } from '../../../shared/table';
import type { PayslipRowModel } from '../../../../../adapters/presenters/payslips/payslips.view-models';

/** One payslip line of the P1.5 table. */
export function PayslipRow({ payslip }: { payslip: PayslipRowModel }) {
  const common = i18n.messages.common;

  return (
    <TableRow
      className={cn(
        'gap-4 px-5 py-1.75 last:border-b',
        payslip.isNew && 'bg-blue-50',
      )}
    >
      <TableCell className="flex items-center gap-3 font-semibold text-foreground">
        <i aria-hidden className="ri-file-paper-2-line text-20 text-primary" />
        <span>{payslip.period}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">{payslip.availableOn}</TableCell>
      <TableCell>{payslip.netPay}</TableCell>
      <TableCell>
        <Badge tone={payslip.status.tone}>{payslip.status.label}</Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-2">
        <Button asChild variant="outline" size="xs" className="gap-1.5">
          <Link to={AppRoutes.payslip} params={{ payslipId: payslip.id }}>
            <i aria-hidden className="ri-eye-line" />
            {common.view}
          </Link>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={common.download}
          className="rounded-lg text-18"
        >
          <i aria-hidden className="ri-download-2-line" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
