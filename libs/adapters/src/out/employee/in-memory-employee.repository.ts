import { Employee } from '@hexagonal-monorepo-template/domain';
import { IEmployeeRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly employees = new Map<string, Employee>()) {}

  async insert(employee: Employee): Promise<void> {
    this.employees.set(employee.id, employee);
  }

  async save(employee: Employee): Promise<void> {
    this.employees.set(employee.id, employee);
  }

  async findById(employeeId: string): Promise<Employee | null> {
    return this.employees.get(employeeId) ?? null;
  }
}
