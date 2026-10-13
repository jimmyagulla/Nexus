import { payslipsFixture } from '../../fixtures/payslips.fixture';
import { Payslips } from './Payslips';

/** Placeholder data until the payslips presenter is wired. */
export function PayslipsPage() {
  return <Payslips model={payslipsFixture} />;
}
