import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPayslips } from '../../hooks/useGetPayslips';
import { i18n } from '../../i18n/i18n';
import { Payslips } from './Payslips';

interface PayslipsPageProps {
  deps: PayslipsPageComposition;
}

export function PayslipsPage({ deps }: PayslipsPageProps) {
  const payslips = useGetPayslips(deps);

  if (payslips.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (payslips.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Payslips model={payslips.data} />;
}
