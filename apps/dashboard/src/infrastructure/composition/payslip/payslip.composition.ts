import {
  createPayslipsPageComposition,
  type PayslipsPageComposition,
} from './payslips-page.composition';
import {
  createPayslipPageComposition,
  type PayslipPageComposition,
} from './payslip-page.composition';

/** Compositions of the payslip pages. */
export type PayslipComposition = {
  payslips: PayslipsPageComposition;
  payslip: PayslipPageComposition;
};

export function createPayslipComposition(): PayslipComposition {
  return {
    payslips: createPayslipsPageComposition(),
    payslip: createPayslipPageComposition(),
  };
}
