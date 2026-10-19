import { useState } from 'react';
import { FileActionsMenu } from '../../../common/data/FileActionsMenu';
import { FileContextMenu } from '../../../common/data/FileContextMenu';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import type { PayslipRowModel } from '../../../../../adapters/presenters/payslips/payslip-row.presenter';

interface PayslipRowProps {
  payslip: PayslipRowModel;
  onView: (payslipId: string) => void;
  onDownload: (payslipId: string) => void;
}

/** One payslip line of the P1.5 table; a right click opens its actions under the cursor. */
export function PayslipRow({ payslip, onView, onDownload }: PayslipRowProps) {
  const [contextPoint, setContextPoint] = useState<{ x: number; y: number } | null>(null);
  const view = () => onView(payslip.id);
  const download = () => onDownload(payslip.id);

  return (
    <TableRow
      className={cn(
        'gap-4 px-5 py-1.75 last:border-b',
        payslip.isNew && 'bg-blue-50',
      )}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextPoint({ x: event.clientX, y: event.clientY });
      }}
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
      <TableCell className="flex justify-end gap-0.5 text-18 text-primary">
        <FileActionsMenu onView={view} onDownload={download} />
        <FileContextMenu
          point={contextPoint}
          onClose={() => setContextPoint(null)}
          onView={view}
          onDownload={download}
        />
      </TableCell>
    </TableRow>
  );
}
