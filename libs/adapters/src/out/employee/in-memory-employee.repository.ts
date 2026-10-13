import { Employee } from '@hexagonal-monorepo-template/domain';
import { IEmployeeRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly employees: readonly Employee[] = []) {}

  async findById(
    companyId: string,
    employeeId: string,
  ): Promise<Employee | null> {
    return (
      this.employees.find(
        (employee) =>
          employee.companyId === companyId && employee.id === employeeId,
      ) ?? null
    );
  }
}
