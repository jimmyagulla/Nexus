import { Employee } from '../entities/employee';
import { ErrorCode } from '../errors/error-code';

export function requireActiveEmployee(employee: Employee | null): Employee {
  if (employee === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  if (!employee.isActive()) {
    throw new Error(ErrorCode.INACTIVE_EMPLOYEE);
  }
  return employee;
}
