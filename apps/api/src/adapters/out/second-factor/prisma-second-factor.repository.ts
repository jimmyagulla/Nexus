import { SecondFactor } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toPrismaSecondFactorData,
  toSecondFactor,
} from './prisma-second-factor.mapper';

export class PrismaSecondFactorRepository implements ISecondFactorRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async findByUserId(userId: string): Promise<SecondFactor | null> {
    const row = await this.prisma.secondFactor.findUnique({
      where: { userId },
    });
    return row === null ? null : toSecondFactor(row);
  }

  async save(factor: SecondFactor): Promise<void> {
    const data = toPrismaSecondFactorData(factor);
    await this.prisma.secondFactor.upsert({
      where: { userId: data.userId },
      create: data,
      update: {
        secret: data.secret,
        enrolled: data.enrolled,
        recoveryCodeDigests: data.recoveryCodeDigests,
      },
    });
  }
}
