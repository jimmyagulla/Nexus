import { ProfessionalExpenseRequestPresenter } from '../../adapters/presenters/professional-expenses/professional-expense-request.presenter';
import { ProfessionalExpensesPresenter } from '../../adapters/presenters/professional-expenses/professional-expenses.presenter';
import { professionalExpenseRequestFixture, professionalExpensesFixture } from '../ui/fixtures/professional-expenses.fixture';

export type ProfessionalExpensesComposition = {
  professionalExpensesPresenter: ProfessionalExpensesPresenter;
  professionalExpenseRequestPresenter: ProfessionalExpenseRequestPresenter;
};

/** Presenters of the professional expenses screens, fed with placeholder data for now. */
export function createProfessionalExpensesComposition(): ProfessionalExpensesComposition {
  return {
    professionalExpensesPresenter: new ProfessionalExpensesPresenter(professionalExpensesFixture),
    professionalExpenseRequestPresenter: new ProfessionalExpenseRequestPresenter(professionalExpenseRequestFixture),
  };
}
