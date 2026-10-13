import {
  createProfessionalExpensesPageComposition,
  type ProfessionalExpensesPageComposition,
} from './professional-expenses-page.composition';
import {
  createProfessionalExpenseRequestPageComposition,
  type ProfessionalExpenseRequestPageComposition,
} from './professional-expense-request-page.composition';

/** Compositions of the professional expense pages. */
export type ProfessionalExpenseComposition = {
  professionalExpenses: ProfessionalExpensesPageComposition;
  professionalExpenseRequest: ProfessionalExpenseRequestPageComposition;
};

export function createProfessionalExpenseComposition(): ProfessionalExpenseComposition {
  return {
    professionalExpenses: createProfessionalExpensesPageComposition(),
    professionalExpenseRequest: createProfessionalExpenseRequestPageComposition(),
  };
}
