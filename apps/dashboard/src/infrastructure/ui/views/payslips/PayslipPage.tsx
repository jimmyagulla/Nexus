import { payslipFixture } from '../../fixtures/payslips.fixture';
import { Payslip } from './Payslip';

/** Placeholder data until the payslips presenter is wired. */
export function PayslipPage() {
  return <Payslip model={payslipFixture} />;
}
