import { ProfessionalExpensesPresenter } from '../../adapters/presenters/professional-expenses/professional-expenses.presenter';

export type ProfessionalExpensesComposition = {
  presenter: ProfessionalExpensesPresenter;
};

export function createProfessionalExpensesComposition(): ProfessionalExpensesComposition {
  return { presenter: new ProfessionalExpensesPresenter() };
}
