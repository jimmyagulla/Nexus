import { Module } from '@nestjs/common';
import {
  BeginSecondFactorEnrollmentUseCase,
  ConfirmSecondFactorEnrollmentUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  IBeginSecondFactorEnrollment,
  IClock,
  IConfirmSecondFactorEnrollment,
  ISecondFactorCodes,
  ISecondFactorRepository,
} from '@hexagonal-monorepo-template/ports';
import { SecondFactorController } from '../../adapters/http/second-factor/second-factor.controller';
import { PrismaSecondFactorRepository } from '../../adapters/out/second-factor/prisma-second-factor.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [SecondFactorController],
  providers: [
    {
      provide: ISecondFactorRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaSecondFactorRepository(prisma);
        }
        return new InMemorySecondFactorRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: ISecondFactorCodes,
      useFactory: () => new TotpSecondFactorCodes(),
    },
    {
      provide: IBeginSecondFactorEnrollment,
      useFactory: (
        factors: ISecondFactorRepository,
        codes: ISecondFactorCodes,
      ) => new BeginSecondFactorEnrollmentUseCase(factors, codes),
      inject: [ISecondFactorRepository, ISecondFactorCodes],
    },
    {
      provide: IConfirmSecondFactorEnrollment,
      useFactory: (
        factors: ISecondFactorRepository,
        codes: ISecondFactorCodes,
        clock: IClock,
      ) => new ConfirmSecondFactorEnrollmentUseCase(factors, codes, clock),
      inject: [ISecondFactorRepository, ISecondFactorCodes, IClock],
    },
  ],
  exports: [ISecondFactorRepository],
})
export class SecondFactorModule {}
