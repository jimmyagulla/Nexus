import { PayslipPresenter } from '../../adapters/presenters/payslips/payslip.presenter';
import { PayslipsPresenter } from '../../adapters/presenters/payslips/payslips.presenter';
import { payslipFixture, payslipsFixture } from '../ui/fixtures/payslips.fixture';

export type PayslipsComposition = {
  payslipsPresenter: PayslipsPresenter;
  payslipPresenter: PayslipPresenter;
};

/** Presenters of the payslips screens, fed with placeholder data for now. */
export function createPayslipsComposition(): PayslipsComposition {
  return {
    payslipsPresenter: new PayslipsPresenter(payslipsFixture),
    payslipPresenter: new PayslipPresenter(payslipFixture),
  };
}
