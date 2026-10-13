import { PayslipPresenter } from '../../adapters/presenters/payslips/payslip.presenter';

export type PayslipComposition = {
  presenter: PayslipPresenter;
};

export function createPayslipComposition(): PayslipComposition {
  return { presenter: new PayslipPresenter() };
}
