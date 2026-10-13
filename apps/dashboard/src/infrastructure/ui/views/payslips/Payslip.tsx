import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';
import { DownloadToast } from './components/DownloadToast';
import { PayslipDetailRow } from './components/PayslipDetailRow';
import { PayslipPreview } from './components/PayslipPreview';

export interface PayslipViewModel {
  fileName: string;
  zoom: string;
  pages: string;
  title: string;
  period: string;
  availableOn: string;
  issuer: string;
  size: string;
  netPay: string;
  previous?: { id: string; label: string };
  /** Following month, shown disabled when not yet available. */
  next: { id?: string; label: string };
  downloadedFileName?: string;
}

interface PayslipProps {
  model: PayslipViewModel;
}

/** P1.6 — one payslip: PDF preview, details, download and month navigation. */
export function Payslip({ model }: PayslipProps) {
  const labels = i18n.messages.payslips.detail;

  return (
    <>
      <PageContent className="grid min-h-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:py-6">
        <Card className="flex min-h-0 flex-col">
          <div className="box-content flex h-12 items-center gap-3 border-b border-border px-4 text-13 text-muted-foreground">
            <i aria-hidden className="ri-file-pdf-2-line text-18 text-primary" />
            <span className="flex-1 truncate font-semibold text-foreground">
              {model.fileName}
            </span>
            <button
              type="button"
              aria-label={labels.zoomOut}
              className="flex outline-none hover:text-primary focus-visible:shadow-focus"
            >
              <i aria-hidden className="ri-zoom-out-line text-18" />
            </button>
            <span>{model.zoom}</span>
            <button
              type="button"
              aria-label={labels.zoomIn}
              className="flex outline-none hover:text-primary focus-visible:shadow-focus"
            >
              <i aria-hidden className="ri-zoom-in-line text-18" />
            </button>
            <span className="h-5 w-px bg-border" />
            <span>{model.pages}</span>
          </div>
          <div className="flex min-h-0 flex-1 justify-center bg-grey-100 p-6">
            <PayslipPreview />
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-20 font-bold leading-6.5 text-heading">{model.title}</h1>
              <span className="text-13 text-muted-foreground">{labels.payslip}</span>
            </div>
            <div className="flex flex-col gap-2.5 text-14">
              <PayslipDetailRow label={labels.period} value={model.period} />
              <PayslipDetailRow label={labels.availableOn} value={model.availableOn} />
              <PayslipDetailRow label={labels.issuer} value={model.issuer} />
              <PayslipDetailRow label={labels.size} value={model.size} />
              <PayslipDetailRow label={labels.netPay} value={model.netPay} total />
            </div>
            <Button type="button" className="h-11">
              <i aria-hidden className="ri-download-2-line" />
              {i18n.messages.common.download}
            </Button>
            <Button type="button" variant="outline" className="h-11">
              <i aria-hidden className="ri-printer-line" />
              {labels.print}
            </Button>
          </Card>
          <div className="flex gap-2.5 rounded-lg border border-border bg-card p-3.5">
            <i aria-hidden className="ri-shield-check-line text-18 text-green-500" />
            <span className="text-13 leading-4.5 text-muted-foreground">
              {labels.retention}
            </span>
          </div>
          <div className="flex justify-between text-13 font-semibold text-link">
            {model.previous ? (
              <Link
                to={AppRoutes.payslip}
                params={{ payslipId: model.previous.id }}
                className="outline-none hover:text-link-hover focus-visible:shadow-focus"
              >
                <i aria-hidden className="ri-arrow-left-s-line" />
                {` ${model.previous.label}`}
              </Link>
            ) : (
              <span />
            )}
            {model.next.id ? (
              <Link
                to={AppRoutes.payslip}
                params={{ payslipId: model.next.id }}
                className="outline-none hover:text-link-hover focus-visible:shadow-focus"
              >
                {`${model.next.label} `}
                <i aria-hidden className="ri-arrow-right-s-line" />
              </Link>
            ) : (
              <span aria-disabled className="text-grey-400">
                {`${model.next.label} `}
                <i aria-hidden className="ri-arrow-right-s-line" />
              </span>
            )}
          </div>
        </div>
      </PageContent>
      {model.downloadedFileName && (
        <DownloadToast fileName={model.downloadedFileName} />
      )}
    </>
  );
}
