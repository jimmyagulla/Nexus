import { employeeFixture } from '../../fixtures/employees.fixture';
import { Employee } from './Employee';

/** Placeholder data until the employee space presenter is wired. */
export function EmployeePage() {
  return <Employee model={employeeFixture} />;
}
