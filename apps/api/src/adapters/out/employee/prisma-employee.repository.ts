import { Employee } from '@hexagonal-monorepo-template/domain';
import { IEmployeeRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toEmployee } from './prisma-employee.mapper';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(employee: Employee): Promise<void> {
    await this.prisma.employee.create({ data: this.toRow(employee) });
  }

  async save(employee: Employee): Promise<void> {
    const { id, ...data } = this.toRow(employee);
    await this.prisma.employee.update({ where: { id }, data });
  }

  async findById(employeeId: string): Promise<Employee | null> {
    const row = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    return row === null ? null : toEmployee(row);
  }

  private toRow(employee: Employee) {
    return {
      id: employee.id,
      companyId: employee.companyId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      status: employee.status,
      lastActivityAt: employee.lastActivityAt,
    };
  }
}
