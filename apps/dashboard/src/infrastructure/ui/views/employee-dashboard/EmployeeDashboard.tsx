import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card, CardHeader, CardTitle } from '../../shared/card';
import { ActivityRow, type ActivityModel } from './components/ActivityRow';
import { FlowTile, type FlowTileModel } from './components/FlowTile';
import { LeaveBalanceCard, type LeaveBalanceModel } from './components/LeaveBalanceCard';
import { MobileFlowRow, type MobileFlowRowModel } from './components/MobileFlowRow';
import { PayslipBanner, type PayslipBannerModel } from './components/PayslipBanner';
import { QuickAction, type QuickActionModel } from './components/QuickAction';

export interface EmployeeDashboardViewModel {
  firstName: string;
  lastLogin: string;
  leaveBalance: LeaveBalanceModel;
  flows: FlowTileModel[];
  activities: ActivityModel[];
  mobile: {
    payslipBanner: PayslipBannerModel;
    flows: MobileFlowRowModel[];
  };
}

interface EmployeeDashboardProps {
  model: EmployeeDashboardViewModel;
}

/** P1.3 — employee dashboard; M.1 below the `md` breakpoint. */
export function EmployeeDashboard({ model }: EmployeeDashboardProps) {
  const labels = i18n.messages.employeeDashboard;
  const welcome = `${labels.welcome} ${model.firstName}`;
  const quickActions: QuickActionModel[] = [
    {
      id: 'leave-request',
      icon: 'ri-sun-line',
      label: labels.quickActions.leaveRequest,
      link: { to: AppRoutes.leaveRequest },
      primary: true,
    },
    {
      id: 'overtime-declaration',
      icon: 'ri-time-line',
      label: labels.quickActions.overtimeDeclaration,
      link: { to: AppRoutes.overtimeDeclaration },
    },
    {
      id: 'expense-report',
      icon: 'ri-receipt-line',
      label: labels.quickActions.expenseReport,
      link: { to: AppRoutes.expenseReport, params: { expenseReportId: '2026-09' } },
    },
    {
      id: 'document-upload',
      icon: 'ri-upload-cloud-2-line',
      label: labels.quickActions.documentUpload,
      link: { to: AppRoutes.documentUpload },
    },
  ];

  return (
    <>
      <PageContent className="hidden gap-5 md:flex md:py-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-3">
            <h1 className="whitespace-nowrap text-28 font-bold leading-9 text-heading">
              {welcome}
            </h1>
            <span className="whitespace-nowrap text-14 text-muted-foreground">
              {`${labels.lastLogin} ${model.lastLogin}`}
            </span>
          </div>
          <span className="flex items-center gap-2 whitespace-nowrap text-13 text-muted-foreground">
            <i aria-hidden className="ri-lock-2-line text-16 text-green-500" />
            {labels.privacyNote}
          </span>
        </div>
        <LeaveBalanceCard balance={model.leaveBalance} />
        <Card className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {model.flows.map((tile) => (
            <FlowTile key={tile.id} tile={tile} />
          ))}
          <button
            type="button"
            className="flex min-w-0 items-center gap-3 border-b border-border px-4.5 py-3 text-13 font-semibold text-link outline-none hover:text-link-hover focus-visible:shadow-focus"
          >
            <i aria-hidden className="ri-apps-2-line text-18" />
            <span className="whitespace-nowrap">{labels.allSpaces}</span>
          </button>
        </Card>
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)] items-start gap-5">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>{labels.activities.title}</CardTitle>
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-13 hover:no-underline"
              >
                {labels.activities.seeAll}
              </Button>
            </CardHeader>
            {model.activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </Card>
          <Card className="flex flex-col gap-2 px-4.5 py-3.5">
            <CardTitle className="mb-0.5">{labels.quickActions.title}</CardTitle>
            {quickActions.map((action) => (
              <QuickAction key={action.id} action={action} />
            ))}
          </Card>
        </div>
      </PageContent>

      <PageContent className="gap-3.5 p-5 md:hidden">
        <div className="flex flex-col gap-1">
          <h1 className="text-24 font-bold leading-7.5 text-heading">{welcome}</h1>
          <span className="flex items-center gap-1.5 text-13 text-muted-foreground">
            <i aria-hidden className="ri-lock-2-line text-green-500" />
            {labels.mobileSecureSpace}
          </span>
        </div>
        <PayslipBanner banner={model.mobile.payslipBanner} />
        {model.mobile.flows.map((row) => (
          <MobileFlowRow key={row.id} row={row} />
        ))}
      </PageContent>
    </>
  );
}
