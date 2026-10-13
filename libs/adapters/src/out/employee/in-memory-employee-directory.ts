import { EmployeeReference } from '@hexagonal-monorepo-template/domain';
import { IEmployeeDirectory } from '@hexagonal-monorepo-template/ports';

export class InMemoryEmployeeDirectory implements IEmployeeDirectory {
  constructor(private readonly employees: readonly EmployeeReference[] = []) {}

  async findInCompany(
    companyId: string,
    employeeId: string,
  ): Promise<EmployeeReference | null> {
    return (
      this.employees.find(
        (employee) =>
          employee.companyId === companyId && employee.id === employeeId,
      ) ?? null
    );
  }

  async findByUserId(
    companyId: string,
    userId: string,
  ): Promise<EmployeeReference | null> {
    return (
      this.employees.find(
        (employee) =>
          employee.companyId === companyId && employee.userId === userId,
      ) ?? null
    );
  }

  async listInCompany(
    companyId: string,
  ): Promise<readonly EmployeeReference[]> {
    return this.employees.filter((employee) => employee.companyId === companyId);
  }
}
