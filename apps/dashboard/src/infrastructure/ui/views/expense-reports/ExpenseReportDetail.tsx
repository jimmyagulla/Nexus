import { InfoNote } from '../../common/feedback/InfoNote';
import { IconTile } from '../../common/data/IconTile';
import { i18n } from '../../i18n/i18n';
import type { FilePreview } from '../../lib/file-preview';
import { Badge } from '../../shared/badge';
import { Button } from '../../shared/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ModalBody,
} from '../../shared/dialog';
import { ExpenseReportDetailField } from './components/ExpenseReportDetailField';
import { ExpenseReportProofPanel } from './components/ExpenseReportProofPanel';
import type { ExpenseReportDetailModel } from '../../../../adapters/presenters/expense-reports/expense-report-detail.presenter';

interface ExpenseReportDetailProps {
  model: ExpenseReportDetailModel;
  preview: FilePreview | undefined;
  previewLoading: boolean;
  previewError: string | null;
  onEdit: () => void;
  onDownloadProof: () => void;
}

/** The full detail of a report: its fields on the left, its receipt on the right. */
export function ExpenseReportDetail({
  model,
  preview,
  previewLoading,
  previewError,
  onEdit,
  onDownloadProof,
}: ExpenseReportDetailProps) {
  const labels = i18n.messages.expenseReports.detail;
  const common = i18n.messages.common;

  return (
    <>
      <DialogHeader>
        <IconTile tone="amber" size={40} className="text-20">
          <i aria-hidden className={model.icon} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <DialogTitle className="truncate">{model.title}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Badge tone={model.status.tone}>{model.status.label}</Badge>
            </div>
          </DialogDescription>
        </div>
      </DialogHeader>
      <ModalBody className="flex border-t border-border">
        <div className="flex w-90 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border p-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            {model.fields.map((field) => (
              <ExpenseReportDetailField key={field.label} model={field} />
            ))}
          </dl>
          {model.lockedNote !== null && <InfoNote>{model.lockedNote}</InfoNote>}
        </div>
        <ExpenseReportProofPanel
          proof={model.proof}
          noProofLabel={model.noProofLabel}
          preview={preview}
          loading={previewLoading}
          error={previewError}
        />
      </ModalBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {common.close}
          </Button>
        </DialogClose>
        {model.proof !== null && (
          <Button type="button" variant="outline" onClick={onDownloadProof} disabled={preview === undefined}>
            <i aria-hidden className="ri-download-2-line text-18" />
            {common.download}
          </Button>
        )}
        {model.editable && (
          <Button type="button" onClick={onEdit}>
            <i aria-hidden className="ri-edit-line text-18" />
            {labels.edit}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
