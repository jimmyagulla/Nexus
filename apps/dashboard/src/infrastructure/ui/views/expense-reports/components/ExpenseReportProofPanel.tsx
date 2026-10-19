import { PageStatus } from '../../../common/feedback/PageStatus';
import { FileViewer } from '../../../common/files/FileViewer';
import { i18n } from '../../../i18n/i18n';
import type { FilePreview } from '../../../lib/file-preview';
import type { ExpenseReportDetailModel } from '../../../../../adapters/presenters/expense-reports/expense-report-detail.presenter';

interface ExpenseReportProofPanelProps {
  proof: ExpenseReportDetailModel['proof'];
  noProofLabel: string;
  preview: FilePreview | undefined;
  loading: boolean;
  /** Translated failure, if the receipt could not be opened. */
  error: string | null;
}

/** The receipt of a report, read inside the app; a notice when there is none. */
export function ExpenseReportProofPanel({
  proof,
  noProofLabel,
  preview,
  loading,
  error,
}: ExpenseReportProofPanelProps) {
  if (proof === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-muted px-6 text-center text-14 text-muted-foreground">
        <i aria-hidden className="ri-file-forbid-line text-32 text-disabled" />
        {noProofLabel}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-2.5">
        <i aria-hidden className={`${proof.icon} text-20 text-primary`} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-14 font-semibold">{proof.name}</span>
          <span className="text-12 text-subtle">{proof.details}</span>
        </div>
      </div>
      {loading && <PageStatus>{i18n.messages.common.preview.loading}</PageStatus>}
      {error !== null && <PageStatus>{error}</PageStatus>}
      {preview !== undefined && <FileViewer preview={preview} />}
    </div>
  );
}
