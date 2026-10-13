import { Account, ErrorCode } from '@hexagonal-monorepo-template/domain';
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

  async consumeInvitation(
    activated: Account,
    invitationToken: string,
  ): Promise<void> {
    const { id, ...data } = this.toRow(activated);
    const { count } = await this.prisma.account.updateMany({
      where: { id, invitationToken },
      data,
    });
    if (count === 0) {
      throw new Error(ErrorCode.INVITATION_INVALID);
    }
  }

  async listByCompany(companyId: string): Promise<readonly Account[]> {
    const rows = await this.prisma.account.findMany({
      where: { companyId },
    });
    return rows.map(toAccount);
  }

  async findById(accountId: string): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    return row === null ? null : toAccount(row);
  }

  async findByInvitationToken(
    invitationToken: string,
  ): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { invitationToken },
    });
    return row === null ? null : toAccount(row);
  }

  async findByEmployeeId(employeeId: string): Promise<Account | null> {
    const row = await this.prisma.account.findFirst({
      where: { employeeId },
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
      employeeId: account.employeeId,
    };
  }
}
