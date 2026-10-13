import type { AccountingFirmComposition } from '../../../composition/accounting-firm.composition';
import { AccountingFirm } from './AccountingFirm';

interface AccountingFirmPageProps {
  deps: AccountingFirmComposition;
}

export function AccountingFirmPage({ deps }: AccountingFirmPageProps) {
  return <AccountingFirm model={deps.accountingFirmPresenter.present()} />;
}
