import { Employee, EmployeeStatus } from '../entities/employee';
import { ErrorCode } from '../errors/error-code';
import { requireActiveEmployee } from './require-active-employee';

describe('requireActiveEmployee', () => {
  it('returns an active employee', () => {
    const employee = new Employee('e1', 'c1', EmployeeStatus.ACTIVE);

    expect(requireActiveEmployee(employee)).toBe(employee);
  });

  it('refuses an inactive employee', () => {
    expect(() =>
      requireActiveEmployee(new Employee('e1', 'c1', EmployeeStatus.INACTIVE)),
    ).toThrow(ErrorCode.INACTIVE_EMPLOYEE);
  });

  it('refuses an employee that does not exist without saying so', () => {
    expect(() => requireActiveEmployee(null)).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
