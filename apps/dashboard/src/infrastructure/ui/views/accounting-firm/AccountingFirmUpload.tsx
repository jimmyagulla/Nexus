import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import {
  AccountingFirmUploadForm,
  type AccountingFirmUploadFormModel,
} from '../../features/accounting-firm/AccountingFirmUploadForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';

export interface AccountingFirmUploadViewModel {
  firmName: string;
  form: AccountingFirmUploadFormModel;
}

/** P10.2 — upload a document for the accounting firm. */
export function AccountingFirmUpload({
  model,
}: {
  model: AccountingFirmUploadViewModel;
}) {
  const labels = i18n.messages.accountingFirm.upload;

  return (
    <PageContent className="items-center gap-3.5 md:py-6">
      <div className="flex w-195 flex-col gap-1">
        <h1 className="text-24 leading-8 font-bold text-heading">
          {labels.title}
        </h1>
        <span className="text-14 text-muted-foreground">{labels.description}</span>
      </div>

      <Card className="flex w-195 flex-col overflow-hidden">
        <div className="flex items-center gap-3 bg-grey-950 px-6 py-3 text-white">
          <i aria-hidden className="ri-building-4-line text-20" />
          <span className="flex-1 text-14">
            <b>{labels.recipient}</b>
            {` · ${model.firmName}`}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-12 text-green-200">
            <i aria-hidden className="ri-lock-2-line" />
            {labels.secureExchange}
          </span>
        </div>

        <AccountingFirmUploadForm model={model.form} />

        <div className="flex justify-end gap-3 border-t border-border px-6 py-3.5">
          <Button variant="outline">{i18n.messages.common.saveDraft}</Button>
          <Button asChild className="px-5">
            <Link to={AppRoutes.accountingFirm}>
              <i aria-hidden className="ri-send-plane-line" />
              {labels.send}
            </Link>
          </Button>
        </div>
      </Card>
    </PageContent>
  );
}
