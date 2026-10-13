import type { EmployeesComposition } from '../../../composition/employees.composition';
import { Employees } from './Employees';

interface EmployeesPageProps {
  deps: EmployeesComposition;
}

export function EmployeesPage({ deps }: EmployeesPageProps) {
  return <Employees model={deps.employeesPresenter.present()} />;
}
