import type { PayslipPageComposition } from '../../../composition/payslip/payslip-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPayslip } from '../../hooks/useGetPayslip';
import { i18n } from '../../i18n/i18n';
import { Payslip } from './Payslip';

interface PayslipPageProps {
  deps: PayslipPageComposition;
}

export function PayslipPage({ deps }: PayslipPageProps) {
  const payslip = useGetPayslip(deps);

  if (payslip.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (payslip.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Payslip model={payslip.data} />;
}
