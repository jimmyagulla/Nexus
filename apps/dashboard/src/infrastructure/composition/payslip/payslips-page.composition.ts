import { PayslipsPresenter } from '../../../adapters/presenters/payslips/payslips.presenter';

export type PayslipsPageComposition = {
  presenter: PayslipsPresenter;
};

export function createPayslipsPageComposition(): PayslipsPageComposition {
  return { presenter: new PayslipsPresenter() };
}
