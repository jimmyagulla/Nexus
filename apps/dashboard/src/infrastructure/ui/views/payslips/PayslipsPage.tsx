import { useState } from 'react';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { FilePreviewModal } from '../../common/files/FilePreviewModal';
import { useDownloadPayslip } from '../../hooks/payslips/useDownloadPayslip';
import { useExportPayslips } from '../../hooks/payslips/useExportPayslips';
import { useGetPayslips } from '../../hooks/payslips/useGetPayslips';
import { useGetPayslipYears } from '../../hooks/payslips/useGetPayslipYears';
import { useViewPayslip } from '../../hooks/payslips/useViewPayslip';
import { useToast } from '../../hooks/use-toast';
import { i18n } from '../../i18n/i18n';
import { saveFile } from '../../lib/save-file';
import { usePayslipsListStore } from '../../stores/payslips-list.store';
import { Payslips } from './Payslips';
import type { PayslipsListHandlers } from './components/payslips-list.handlers';

interface PayslipsPageProps {
  deps: PayslipsPageComposition;
}

export function PayslipsPage({ deps }: PayslipsPageProps) {
  const { errorToast } = useToast();
  const chosenYear = usePayslipsListStore((state) => state.year);
  const setYear = usePayslipsListStore((state) => state.setYear);
  const years = useGetPayslipYears(deps);
  const criteria = deps.controller.criteriaFor({ year: chosenYear }, years.data);
  const payslips = useGetPayslips(deps, criteria);
  const view = useViewPayslip(deps);
  const download = useDownloadPayslip(deps);
  const exportAll = useExportPayslips(deps);
  /** Payslip shown in the in-app viewer. */
  const [previewed, setPreviewed] = useState<{ id: string; period: string } | null>(null);

  const showError = (error: unknown) => errorToast(deps.errorPresenter.present(error));

  const handlers: PayslipsListHandlers = {
    onChooseYear: setYear,
    onView: (payslipId) => {
      const row = payslips.data?.rows.find((payslip) => payslip.id === payslipId);
      setPreviewed({ id: payslipId, period: row?.period ?? '' });
      view.mutate(payslipId);
    },
    onDownload: (payslipId) => download.mutate(payslipId, { onError: showError }),
    onDownloadAll: () => {
      if (criteria !== null) {
        exportAll.mutate(criteria, { onError: showError });
      }
    },
  };

  const closePreview = () => {
    if (view.data !== undefined) {
      URL.revokeObjectURL(view.data.objectUrl);
    }
    view.reset();
    setPreviewed(null);
  };

  if (years.isError || payslips.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  if (payslips.data === undefined) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  return (
    <>
      <Payslips
        summary={payslips.data.summary}
        year={payslips.data.year}
        rows={payslips.data.rows}
        handlers={handlers}
        exporting={exportAll.isPending}
      />
      <FilePreviewModal
        open={previewed !== null}
        onOpenChange={(open) => (open ? undefined : closePreview())}
        title={view.data?.fileName ?? previewed?.period ?? ''}
        preview={view.data}
        loading={view.isPending}
        error={view.isError ? deps.errorPresenter.present(view.error) : null}
        onDownload={() => {
          if (view.data !== undefined) {
            saveFile(view.data.objectUrl, view.data.fileName);
          }
        }}
      />
    </>
  );
}
