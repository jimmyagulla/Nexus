import { Employee } from '@hexagonal-monorepo-template/domain';
import { IEmployeeRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async findById(
    companyId: string,
    employeeId: string,
  ): Promise<Employee | null> {
    const row = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    return row === null ? null : new Employee(row.id, row.companyId, row.status);
  }
}
