import type { EmployeeComposition } from '../../../composition/employee.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployee } from '../../hooks/useGetEmployee';
import { i18n } from '../../i18n/i18n';
import { Employee } from './Employee';

interface EmployeePageProps {
  deps: EmployeeComposition;
}

export function EmployeePage({ deps }: EmployeePageProps) {
  const employee = useGetEmployee(deps);

  if (employee.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (employee.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Employee model={employee.data} />;
}
