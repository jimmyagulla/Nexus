import { ProfessionalExpensesPresenter } from '../../../adapters/presenters/professional-expenses/professional-expenses.presenter';

export type ProfessionalExpensesPageComposition = {
  presenter: ProfessionalExpensesPresenter;
};

export function createProfessionalExpensesPageComposition(): ProfessionalExpensesPageComposition {
  return { presenter: new ProfessionalExpensesPresenter() };
}
