import { Employee } from '@hexagonal-monorepo-template/domain';

export interface IEmployeeRepository {
  insert(employee: Employee): Promise<void>;
  save(employee: Employee): Promise<void>;
  findById(employeeId: string): Promise<Employee | null>;
}

export const IEmployeeRepository = Symbol('IEmployeeRepository');
