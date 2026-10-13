import { PayslipsPresenter } from '../../adapters/presenters/payslips/payslips.presenter';

export type PayslipsComposition = {
  presenter: PayslipsPresenter;
};

export function createPayslipsComposition(): PayslipsComposition {
  return { presenter: new PayslipsPresenter() };
}
