import type { EmployeesComposition } from '../../../composition/employees.composition';
import { Employee } from './Employee';

interface EmployeePageProps {
  deps: EmployeesComposition;
}

export function EmployeePage({ deps }: EmployeePageProps) {
  return <Employee model={deps.employeePresenter.present()} />;
}
