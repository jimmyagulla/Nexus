import { CabinetConnection } from '@hexagonal-monorepo-template/domain';
import { ICabinetConnectionRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaCabinetConnectionRepository
  implements ICabinetConnectionRepository
{
  constructor(private readonly prisma: PrismaDb) {}

  async save(connection: CabinetConnection): Promise<void> {
    await this.prisma.cabinetConnection.upsert({
      where: { companyId: connection.companyId },
      create: { companyId: connection.companyId, status: connection.status },
      update: { status: connection.status },
    });
  }

  async findByCompanyId(companyId: string): Promise<CabinetConnection | null> {
    const row = await this.prisma.cabinetConnection.findUnique({
      where: { companyId },
    });
    return row === null ? null : new CabinetConnection(row.companyId, row.status);
  }
}
