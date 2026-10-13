import { Module } from '@nestjs/common';
import {
  BeginSecondFactorEnrollmentUseCase,
  ConfirmSecondFactorEnrollmentUseCase,
  OpenSecondFactorChallengeUseCase,
  VerifySecondFactorUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  CryptoRecoveryCodes,
  InMemorySecondFactorIdentityBinder,
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  IBeginSecondFactorEnrollment,
  IClock,
  IConfirmSecondFactorEnrollment,
  IOpenSecondFactorChallenge,
  IRecoveryCodes,
  ISecondFactorCodes,
  ISecondFactorIdentityBinder,
  ISecondFactorRepository,
  IVerifySecondFactor,
} from '@hexagonal-monorepo-template/ports';
import { SecondFactorController } from '../../adapters/http/second-factor/second-factor.controller';
import { SupabaseSecondFactorIdentityBinder } from '../../adapters/out/identity/supabase-second-factor-identity-binder';
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
      provide: IRecoveryCodes,
      useFactory: () => new CryptoRecoveryCodes(),
    },
    {
      provide: ISecondFactorIdentityBinder,
      useFactory: (config: ApiConfig) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabaseSecondFactorIdentityBinder({
            url: config.supabaseUrl,
            serviceRoleKey: config.supabaseServiceRoleKey,
          });
        }
        return new InMemorySecondFactorIdentityBinder();
      },
      inject: [API_CONFIG],
    },
    {
      provide: IOpenSecondFactorChallenge,
      useFactory: (
        factors: ISecondFactorRepository,
        identity: ISecondFactorIdentityBinder,
      ) => new OpenSecondFactorChallengeUseCase(factors, identity),
      inject: [ISecondFactorRepository, ISecondFactorIdentityBinder],
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
        recovery: IRecoveryCodes,
        identity: ISecondFactorIdentityBinder,
        clock: IClock,
      ) =>
        new ConfirmSecondFactorEnrollmentUseCase(
          factors,
          codes,
          recovery,
          identity,
          clock,
        ),
      inject: [
        ISecondFactorRepository,
        ISecondFactorCodes,
        IRecoveryCodes,
        ISecondFactorIdentityBinder,
        IClock,
      ],
    },
    {
      provide: IVerifySecondFactor,
      useFactory: (
        factors: ISecondFactorRepository,
        codes: ISecondFactorCodes,
        recovery: IRecoveryCodes,
        identity: ISecondFactorIdentityBinder,
        clock: IClock,
      ) =>
        new VerifySecondFactorUseCase(
          factors,
          codes,
          recovery,
          identity,
          clock,
        ),
      inject: [
        ISecondFactorRepository,
        ISecondFactorCodes,
        IRecoveryCodes,
        ISecondFactorIdentityBinder,
        IClock,
      ],
    },
  ],
  exports: [ISecondFactorRepository],
})
export class SecondFactorModule {}
