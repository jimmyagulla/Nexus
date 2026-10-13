import { Employee } from './employee';
import { EmployeeStatus } from './employee-status';

function employeeWith(status: EmployeeStatus): Employee {
  return new Employee('employee-1', 'company-1', 'Alice', 'Martin', status, null);
}

describe('Employee', () => {
  it('is open to new actions while active', () => {
    expect(employeeWith(EmployeeStatus.ACTIVE).isActive()).toBe(true);
  });

  it('is closed to new actions once inactive', () => {
    expect(employeeWith(EmployeeStatus.INACTIVE).isActive()).toBe(false);
  });
});
