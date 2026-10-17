import type { AccountingFirmUploadPageComposition } from '../../../composition/accounting-firm/accounting-firm-upload-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetAccountingFirmUpload } from '../../hooks/accounting-firm/useGetAccountingFirmUpload';
import { i18n } from '../../i18n/i18n';
import { AccountingFirmUpload } from './AccountingFirmUpload';

interface AccountingFirmUploadPageProps {
  deps: AccountingFirmUploadPageComposition;
}

export function AccountingFirmUploadPage({ deps }: AccountingFirmUploadPageProps) {
  const accountingFirmUpload = useGetAccountingFirmUpload(deps);

  if (accountingFirmUpload.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (accountingFirmUpload.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <AccountingFirmUpload model={accountingFirmUpload.data} />;
}
