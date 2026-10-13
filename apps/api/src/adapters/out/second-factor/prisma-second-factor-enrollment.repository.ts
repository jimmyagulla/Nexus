import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorEnrollmentRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toSecondFactorEnrollment } from './prisma-second-factor-enrollment.mapper';

export class PrismaSecondFactorEnrollmentRepository
  implements ISecondFactorEnrollmentRepository
{
  constructor(private readonly prisma: PrismaDb) {}

  async insert(enrollment: SecondFactorEnrollment): Promise<void> {
    await this.prisma.secondFactorEnrollment.create({
      data: this.toRow(enrollment),
    });
  }

  async save(enrollment: SecondFactorEnrollment): Promise<void> {
    const { id, ...data } = this.toRow(enrollment);
    await this.prisma.secondFactorEnrollment.update({ where: { id }, data });
  }

  async findById(
    enrollmentId: string,
  ): Promise<SecondFactorEnrollment | null> {
    const row = await this.prisma.secondFactorEnrollment.findUnique({
      where: { id: enrollmentId },
    });
    return row === null ? null : toSecondFactorEnrollment(row);
  }

  async findByAccountId(
    accountId: string,
  ): Promise<SecondFactorEnrollment | null> {
    const row = await this.prisma.secondFactorEnrollment.findUnique({
      where: { accountId },
    });
    return row === null ? null : toSecondFactorEnrollment(row);
  }

  private toRow(enrollment: SecondFactorEnrollment) {
    return {
      id: enrollment.id,
      accountId: enrollment.accountId,
      secret: enrollment.secret,
      status: enrollment.status,
    };
  }
}
