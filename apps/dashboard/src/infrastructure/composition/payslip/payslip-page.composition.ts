import { PayslipPresenter } from '../../../adapters/presenters/payslips/payslip.presenter';

export type PayslipPageComposition = {
  presenter: PayslipPresenter;
};

export function createPayslipPageComposition(): PayslipPageComposition {
  return { presenter: new PayslipPresenter() };
}
