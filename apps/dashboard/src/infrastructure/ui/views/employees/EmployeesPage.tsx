import type { EmployeesPageComposition } from '../../../composition/employee/employees-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployees } from '../../hooks/useGetEmployees';
import { i18n } from '../../i18n/i18n';
import { Employees } from './Employees';

interface EmployeesPageProps {
  deps: EmployeesPageComposition;
}

export function EmployeesPage({ deps }: EmployeesPageProps) {
  const employees = useGetEmployees(deps);

  if (employees.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (employees.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Employees model={employees.data} />;
}
