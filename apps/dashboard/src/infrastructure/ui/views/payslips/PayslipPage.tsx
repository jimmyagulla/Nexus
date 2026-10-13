import type { PayslipsComposition } from '../../../composition/payslips.composition';
import { Payslip } from './Payslip';

interface PayslipPageProps {
  deps: PayslipsComposition;
}

export function PayslipPage({ deps }: PayslipPageProps) {
  return <Payslip model={deps.payslipPresenter.present()} />;
}
