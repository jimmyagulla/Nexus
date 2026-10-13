import { Module } from '@nestjs/common';
import {
  InMemorySecondFactorEnrollmentRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  ISecondFactorCodes,
  ISecondFactorEnrollmentRepository,
} from '@hexagonal-monorepo-template/ports';
import { PrismaSecondFactorEnrollmentRepository } from '../../adapters/out/second-factor/prisma-second-factor-enrollment.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: ISecondFactorEnrollmentRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaSecondFactorEnrollmentRepository(prisma);
        }
        return new InMemorySecondFactorEnrollmentRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: ISecondFactorCodes,
      useFactory: () => new TotpSecondFactorCodes(),
    },
  ],
  exports: [ISecondFactorEnrollmentRepository, ISecondFactorCodes],
})
export class SecondFactorModule {}
