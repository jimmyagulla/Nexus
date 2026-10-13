import { Employee, EmployeeStatus } from '@hexagonal-monorepo-template/domain';

export type PrismaEmployeeRow = {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  status: EmployeeStatus;
  lastActivityAt: Date | null;
};

export function toEmployee(row: PrismaEmployeeRow): Employee {
  return new Employee(
    row.id,
    row.companyId,
    row.firstName,
    row.lastName,
    row.status,
    row.lastActivityAt,
  );
}
