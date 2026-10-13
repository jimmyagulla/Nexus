import { Account } from '@hexagonal-monorepo-template/domain';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toAccount } from './prisma-account.mapper';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: {
        id: account.id,
        companyId: account.companyId,
        identifier: account.identifier.value,
        role: account.role,
        status: account.status,
      },
    });
  }

  async listByCompany(companyId: string): Promise<readonly Account[]> {
    const rows = await this.prisma.account.findMany({
      where: { companyId },
    });
    return rows.map(toAccount);
  }
}
