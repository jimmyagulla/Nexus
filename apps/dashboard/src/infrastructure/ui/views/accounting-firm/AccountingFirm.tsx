import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Tabs, TabsContent, TabsList } from '../../shared/tabs';
import { ExchangesPanel } from './components/ExchangesPanel';
import { ExchangesTab } from './components/ExchangesTab';
import { FirmConnectionCard } from './components/FirmConnectionCard';
import type { AccountingFirmViewModel } from '../../../../adapters/presenters/accounting-firm/accounting-firm.presenter';

/** P10.1 — document exchanges with the accounting firm. */
export function AccountingFirm({ model }: { model: AccountingFirmViewModel }) {
  const labels = i18n.messages.accountingFirm.exchanges;

  return (
    <PageContent className="gap-3.5 md:px-8 md:py-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-28 leading-9 font-bold text-heading">
            {labels.title}
          </h1>
          <span className="text-14 text-muted-foreground">
            {labels.description}
          </span>
        </div>
        <Button asChild>
          <Link to={AppRoutes.accountingFirmUpload}>
            <i aria-hidden className="ri-upload-cloud-2-line text-18" />
            {labels.uploadForFirm}
          </Link>
        </Button>
      </div>

      <FirmConnectionCard firm={model.firm} />

      <Tabs defaultValue="all" className="flex flex-col gap-3.5">
        <TabsList className="border-b border-border">
          <ExchangesTab
            value="all"
            label={labels.tabs.all}
            count={model.counts.all}
          />
          <ExchangesTab
            value="sent"
            label={labels.tabs.sent}
            count={model.counts.sent}
          />
          <ExchangesTab
            value="received"
            label={labels.tabs.received}
            count={model.counts.received}
          />
        </TabsList>
        <TabsContent value="all">
          <ExchangesPanel exchanges={model.all} />
        </TabsContent>
        <TabsContent value="sent">
          <ExchangesPanel exchanges={model.sent} />
        </TabsContent>
        <TabsContent value="received">
          <ExchangesPanel exchanges={model.received} />
        </TabsContent>
      </Tabs>
    </PageContent>
  );
}
