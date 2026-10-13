import type { AccountingFirmComposition } from '../../../composition/accounting-firm.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetAccountingFirm } from '../../hooks/useGetAccountingFirm';
import { i18n } from '../../i18n/i18n';
import { AccountingFirm } from './AccountingFirm';

interface AccountingFirmPageProps {
  deps: AccountingFirmComposition;
}

export function AccountingFirmPage({ deps }: AccountingFirmPageProps) {
  const accountingFirm = useGetAccountingFirm(deps);

  if (accountingFirm.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (accountingFirm.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <AccountingFirm model={accountingFirm.data} />;
}
