import type { PayslipsComposition } from '../../../composition/payslips.composition';
import { Payslips } from './Payslips';

interface PayslipsPageProps {
  deps: PayslipsComposition;
}

export function PayslipsPage({ deps }: PayslipsPageProps) {
  return <Payslips model={deps.payslipsPresenter.present()} />;
}
