import type { ProfessionalExpensesComposition } from '../../../composition/professional-expenses.composition';
import { ProfessionalExpenses } from './ProfessionalExpenses';

interface ProfessionalExpensesPageProps {
  deps: ProfessionalExpensesComposition;
}

export function ProfessionalExpensesPage({ deps }: ProfessionalExpensesPageProps) {
  return <ProfessionalExpenses model={deps.professionalExpensesPresenter.present()} />;
}
