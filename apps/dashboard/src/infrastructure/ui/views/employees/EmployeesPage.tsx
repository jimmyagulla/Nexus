import { employeesFixture } from '../../fixtures/employees.fixture';
import { Employees } from './Employees';

/** Placeholder data until the employees presenter is wired. */
export function EmployeesPage() {
  return <Employees model={employeesFixture} />;
}
