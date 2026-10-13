import type { ProfessionalExpenseRequestComposition } from '../../../composition/professional-expense-request.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetProfessionalExpenseRequest } from '../../hooks/useGetProfessionalExpenseRequest';
import { i18n } from '../../i18n/i18n';
import { ProfessionalExpenseRequest } from './ProfessionalExpenseRequest';

interface ProfessionalExpenseRequestPageProps {
  deps: ProfessionalExpenseRequestComposition;
}

export function ProfessionalExpenseRequestPage({ deps }: ProfessionalExpenseRequestPageProps) {
  const professionalExpenseRequest = useGetProfessionalExpenseRequest(deps);

  if (professionalExpenseRequest.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (professionalExpenseRequest.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <ProfessionalExpenseRequest model={professionalExpenseRequest.data} />;
}
