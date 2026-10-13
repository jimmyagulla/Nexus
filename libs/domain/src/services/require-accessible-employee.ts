import { Employee } from '../entities/employee';
import { ErrorCode } from '../errors/error-code';

export async function requireAccessibleEmployee(
  employeeId: string,
  actorCompanyId: string | null,
  findById: (id: string) => Promise<Employee | null>,
): Promise<Employee> {
  if (actorCompanyId === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  const employee = await findById(employeeId);
  if (employee === null || employee.companyId !== actorCompanyId) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return employee;
}
