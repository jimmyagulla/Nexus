import { EmployeeReference } from '@hexagonal-monorepo-template/domain';

export interface IEmployeeDirectory {
  findInCompany(
    companyId: string,
    employeeId: string,
  ): Promise<EmployeeReference | null>;
  findByUserId(
    companyId: string,
    userId: string,
  ): Promise<EmployeeReference | null>;
  listInCompany(companyId: string): Promise<readonly EmployeeReference[]>;
}

export const IEmployeeDirectory = Symbol('IEmployeeDirectory');
