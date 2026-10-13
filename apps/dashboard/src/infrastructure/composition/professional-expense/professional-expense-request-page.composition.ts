import { ProfessionalExpenseRequestPresenter } from '../../../adapters/presenters/professional-expenses/professional-expense-request.presenter';

export type ProfessionalExpenseRequestPageComposition = {
  presenter: ProfessionalExpenseRequestPresenter;
};

export function createProfessionalExpenseRequestPageComposition(): ProfessionalExpenseRequestPageComposition {
  return { presenter: new ProfessionalExpenseRequestPresenter() };
}
