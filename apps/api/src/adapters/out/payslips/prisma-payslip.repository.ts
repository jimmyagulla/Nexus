import {
  OwnerScope,
  Payslip,
  PayslipList,
  PayslipListCriteria,
  toPayslipSummary,
} from '@hexagonal-monorepo-template/domain';
import { IPayslipRepository } from '@hexagonal-monorepo-template/ports';
import { Prisma } from '../../../infrastructure/prisma/prisma-client';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toPayslip } from './prisma-payslip.mapper';

/** January to December, the identifier among equals. */
const CHRONOLOGICAL: Prisma.PayslipOrderByWithRelationInput[] = [
  { year: 'asc' },
  { month: 'asc' },
  { id: 'asc' },
];

export class PrismaPayslipRepository implements IPayslipRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async findById(payslipId: string): Promise<Payslip | null> {
    const row = await this.prisma.payslip.findUnique({ where: { id: payslipId } });
    return row === null ? null : toPayslip(row);
  }

  /** The rows of the list and the counts per year, queried side by side. */
  async list(scope: OwnerScope, criteria: PayslipListCriteria): Promise<PayslipList> {
    const [payslips, perYear] = await Promise.all([
      this.findAll(scope, criteria),
      this.prisma.payslip.groupBy({
        by: ['year'],
        where: this.ownedBy(scope),
        _count: { _all: true },
        orderBy: { year: 'asc' },
      }),
    ]);
    return {
      items: payslips.map(toPayslipSummary),
      total: perYear.reduce((sum, group) => sum + group._count._all, 0),
      years: perYear.map((group) => group.year),
    };
  }

  async findAll(scope: OwnerScope, criteria: PayslipListCriteria): Promise<Payslip[]> {
    const rows = await this.prisma.payslip.findMany({
      where: {
        ...this.ownedBy(scope),
        ...(criteria.year === null ? {} : { year: criteria.year }),
      },
      orderBy: CHRONOLOGICAL,
    });
    return rows.map(toPayslip);
  }

  private ownedBy(scope: OwnerScope): Prisma.PayslipWhereInput {
    return { companyId: scope.companyId, employeeId: scope.ownerId };
  }
}
