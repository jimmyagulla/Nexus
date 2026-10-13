import { Link } from '@tanstack/react-router';
import { InfoNote } from '../../common/feedback/InfoNote';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import {
  LeaveRequestForm,
  type LeaveRequestFormValues,
} from '../../features/leaves/LeaveRequestForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';
import {
  LeaveBalanceImpact,
  type LeaveBalanceImpactModel,
} from './components/LeaveBalanceImpact';
import {
  LeaveCountDetail,
  type LeaveCountDetailModel,
} from './components/LeaveCountDetail';

export interface LeaveRequestViewModel {
  form: LeaveRequestFormValues;
  impact: LeaveBalanceImpactModel;
  detail: LeaveCountDetailModel;
  /** "Nadia Roussel, service RH" */
  validator: string;
}

interface LeaveRequestProps {
  model: LeaveRequestViewModel;
}

/** P4.2 — new leave request form with its impact on the balance. */
export function LeaveRequest({ model }: LeaveRequestProps) {
  const labels = i18n.messages.leaves.request;
  const common = i18n.messages.common;

  return (
    <PageContent className="md:py-7">
      <PageHeader
        size="form"
        title={labels.title}
        description={
          <span>
            {`${common.requiredFieldsPrefix} `}
            <span className="text-red-500">*</span>
            {` ${common.requiredFieldsSuffix}`}
          </span>
        }
      />
      <Card className="flex flex-col">
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 p-6">
          <LeaveRequestForm defaults={model.form} />
          <div className="flex flex-col gap-3.5">
            <LeaveBalanceImpact {...model.impact} />
            <LeaveCountDetail {...model.detail} />
            <InfoNote>
              {`${labels.validatedBy} ${model.validator}.`}
            </InfoNote>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button asChild variant="outline">
            <Link to={AppRoutes.leaves}>{common.cancel}</Link>
          </Button>
          <Button asChild className="px-5">
            <Link to={AppRoutes.leaveRequestSent}>
              <i aria-hidden className="ri-send-plane-line" />
              {labels.send}
            </Link>
          </Button>
        </div>
      </Card>
    </PageContent>
  );
}
