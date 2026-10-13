import { Employee } from '@hexagonal-monorepo-template/domain';

export interface IEmployeeRepository {
  findById(companyId: string, employeeId: string): Promise<Employee | null>;
}

export const IEmployeeRepository = Symbol('IEmployeeRepository');
