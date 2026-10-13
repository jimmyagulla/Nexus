import { ProfessionalExpenseRequestPresenter } from '../../adapters/presenters/professional-expenses/professional-expense-request.presenter';

export type ProfessionalExpenseRequestComposition = {
  presenter: ProfessionalExpenseRequestPresenter;
};

export function createProfessionalExpenseRequestComposition(): ProfessionalExpenseRequestComposition {
  return { presenter: new ProfessionalExpenseRequestPresenter() };
}
