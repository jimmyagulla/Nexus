import { Account } from '@hexagonal-monorepo-template/domain';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toAccount } from './prisma-account.mapper';

export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: this.toRow(account),
    });
  }

  async save(account: Account): Promise<void> {
    const { id, ...data } = this.toRow(account);
    await this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async listByCompany(companyId: string): Promise<readonly Account[]> {
    const rows = await this.prisma.account.findMany({
      where: { companyId },
    });
    return rows.map(toAccount);
  }

  async findByInvitationToken(
    invitationToken: string,
  ): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { invitationToken },
    });
    return row === null ? null : toAccount(row);
  }

  async findByIdentifier(identifier: string): Promise<Account | null> {
    const row = await this.prisma.account.findFirst({
      where: { identifier },
    });
    return row === null ? null : toAccount(row);
  }

  private toRow(account: Account) {
    return {
      id: account.id,
      companyId: account.companyId,
      identifier: account.identifier.value,
      role: account.role,
      status: account.status,
      invitationToken: account.invitationToken,
      secretHash: account.secretHash,
      failedSignInCount: account.failedSignInCount,
    };
  }
}
