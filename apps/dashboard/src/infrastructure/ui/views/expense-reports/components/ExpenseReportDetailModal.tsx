import type { FilePreview } from '../../../lib/file-preview';
import { Dialog, ModalContent } from '../../../shared/dialog';
import { ExpenseReportDetail } from '../ExpenseReportDetail';
import type { ExpenseReportDetailModel } from '../../../../../adapters/presenters/expense-reports/expense-report-detail.presenter';

interface ExpenseReportDetailModalProps {
  /** The report to show; the modal is closed without one. */
  model: ExpenseReportDetailModel | null;
  onClose: () => void;
  preview: FilePreview | undefined;
  previewLoading: boolean;
  previewError: string | null;
  onEdit: () => void;
  onDownloadProof: () => void;
}

/** Preview of a report over the list: every field, and its receipt readable in place. */
export function ExpenseReportDetailModal({
  model,
  onClose,
  ...detail
}: ExpenseReportDetailModalProps) {
  return (
    <Dialog open={model !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
      <ModalContent className="h-[calc(100%-2rem)] w-260">
        {model !== null && <ExpenseReportDetail model={model} {...detail} />}
      </ModalContent>
    </Dialog>
  );
}
