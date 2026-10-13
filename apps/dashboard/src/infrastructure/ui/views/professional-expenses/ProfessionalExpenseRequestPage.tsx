import type { ProfessionalExpensesComposition } from '../../../composition/professional-expenses.composition';
import { ProfessionalExpenseRequest } from './ProfessionalExpenseRequest';

interface ProfessionalExpenseRequestPageProps {
  deps: ProfessionalExpensesComposition;
}

export function ProfessionalExpenseRequestPage({ deps }: ProfessionalExpenseRequestPageProps) {
  return <ProfessionalExpenseRequest model={deps.professionalExpenseRequestPresenter.present()} />;
}
