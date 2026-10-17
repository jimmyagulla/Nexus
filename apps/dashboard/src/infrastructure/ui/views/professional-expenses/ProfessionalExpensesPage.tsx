import type { ProfessionalExpensesPageComposition } from '../../../composition/professional-expense/professional-expenses-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetProfessionalExpenses } from '../../hooks/professional-expenses/useGetProfessionalExpenses';
import { i18n } from '../../i18n/i18n';
import { ProfessionalExpenses } from './ProfessionalExpenses';

interface ProfessionalExpensesPageProps {
  deps: ProfessionalExpensesPageComposition;
}

export function ProfessionalExpensesPage({ deps }: ProfessionalExpensesPageProps) {
  const professionalExpenses = useGetProfessionalExpenses(deps);

  if (professionalExpenses.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (professionalExpenses.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <ProfessionalExpenses model={professionalExpenses.data} />;
}
