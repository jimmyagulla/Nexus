import type { AccountingFirmComposition } from '../../../composition/accounting-firm.composition';
import { AccountingFirmUpload } from './AccountingFirmUpload';

interface AccountingFirmUploadPageProps {
  deps: AccountingFirmComposition;
}

export function AccountingFirmUploadPage({ deps }: AccountingFirmUploadPageProps) {
  return <AccountingFirmUpload model={deps.accountingFirmUploadPresenter.present()} />;
}
