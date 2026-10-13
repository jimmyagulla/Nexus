import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Table, TableHead, TableHeader } from '../../shared/table';
import { MobilePayslipRow } from './components/MobilePayslipRow';
import { PayslipRow, type PayslipRowModel } from './components/PayslipRow';

export interface PayslipsViewModel {
  summary: string;
  year: string;
  yearSummary: string;
  hasNextYear: boolean;
  payslips: PayslipRowModel[];
}

interface PayslipsProps {
  model: PayslipsViewModel;
}

const COLUMNS = 'minmax(0, 1fr) 140px 150px 160px 200px';

/** P1.5 — payslips of a year; M.2 below the `md` breakpoint. */
export function Payslips({ model }: PayslipsProps) {
  const labels = i18n.messages.payslips.list;
  const common = i18n.messages.common;

  return (
    <>
      <PageContent className="hidden md:flex md:py-6">
        <PageHeader title={labels.title} description={model.summary} />
        <Table columns={COLUMNS} className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
            <div className="flex h-9 items-center rounded-lg border border-input bg-card">
              <button
                type="button"
                aria-label={labels.previousYear}
                className="box-content flex h-8.5 w-9 items-center justify-center border-r border-border text-20 text-primary outline-none focus-visible:shadow-focus"
              >
                <i aria-hidden className="ri-arrow-left-s-line" />
              </button>
              <button
                type="button"
                aria-label={labels.chooseYear}
                className="flex items-center gap-1.5 px-3.5 text-15 font-bold text-heading outline-none focus-visible:shadow-focus"
              >
                {model.year}
                <i aria-hidden className="ri-arrow-down-s-line text-16 text-primary" />
              </button>
              <button
                type="button"
                aria-label={labels.nextYear}
                disabled={!model.hasNextYear}
                className="box-content flex h-8.5 w-9 items-center justify-center border-l border-border text-20 text-primary outline-none focus-visible:shadow-focus disabled:text-grey-300"
              >
                <i aria-hidden className="ri-arrow-right-s-line" />
              </button>
            </div>
            <span className="text-13 text-muted-foreground">{model.yearSummary}</span>
            <span className="flex-1" />
            <Button type="button" variant="outline" size="xs" className="gap-1.5">
              <i aria-hidden className="ri-download-cloud-2-line" />
              {`${labels.downloadAll} (${model.year})`}
            </Button>
          </div>
          <TableHeader className="gap-4 px-5 py-2.5">
            <TableHead>{labels.period}</TableHead>
            <TableHead>{labels.availableOn}</TableHead>
            <TableHead>{labels.netPay}</TableHead>
            <TableHead>{common.status}</TableHead>
            <TableHead className="justify-end">{common.actions}</TableHead>
          </TableHeader>
          {model.payslips.map((payslip) => (
            <PayslipRow key={payslip.id} payslip={payslip} />
          ))}
        </Table>
      </PageContent>

      <div className="flex flex-col md:hidden">
        <div className="flex h-13 items-center gap-1.5 bg-card px-3">
          <Link
            to={AppRoutes.home}
            aria-label={common.back}
            className="flex size-11 items-center justify-center text-22 text-primary outline-none focus-visible:shadow-focus"
          >
            <i aria-hidden className="ri-arrow-left-line" />
          </Link>
          <h1 className="text-17 font-bold text-heading">{labels.title}</h1>
        </div>
        <div className="flex items-center justify-between border-b border-border bg-card px-5 pb-3">
          <button
            type="button"
            aria-label={labels.previousYear}
            className="flex size-11 items-center justify-center rounded-lg border border-input text-22 text-primary outline-none focus-visible:shadow-focus"
          >
            <i aria-hidden className="ri-arrow-left-s-line" />
          </button>
          <button
            type="button"
            aria-label={labels.chooseYear}
            className="flex items-center gap-1.5 text-18 font-bold text-heading outline-none focus-visible:shadow-focus"
          >
            {model.year}
            <i aria-hidden className="ri-arrow-down-s-line text-18 text-primary" />
          </button>
          <button
            type="button"
            aria-label={labels.nextYear}
            disabled={!model.hasNextYear}
            className="flex size-11 items-center justify-center rounded-lg border border-border text-22 text-primary outline-none focus-visible:shadow-focus disabled:text-grey-300"
          >
            <i aria-hidden className="ri-arrow-right-s-line" />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 px-5 py-4">
          {model.payslips.map((payslip) => (
            <MobilePayslipRow key={payslip.id} payslip={payslip} />
          ))}
        </div>
      </div>
    </>
  );
}
