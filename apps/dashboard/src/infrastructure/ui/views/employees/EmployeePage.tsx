import type { EmployeePageComposition } from '../../../composition/employee/employee-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployee } from '../../hooks/employees/useGetEmployee';
import { i18n } from '../../i18n/i18n';
import { Employee } from './Employee';

interface EmployeePageProps {
  deps: EmployeePageComposition;
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
