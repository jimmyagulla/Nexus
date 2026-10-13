import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemorySecondFactorEnrollmentRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  ISecondFactorCodes,
  ISecondFactorEnrollmentRepository,
} from '@hexagonal-monorepo-template/ports';
import { PrismaSecondFactorEnrollmentRepository } from '../../adapters/out/second-factor/prisma-second-factor-enrollment.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { SecondFactorModule } from './second-factor.module';

@Global()
@Module({})
class TestGlobalsModule {}

const postgresEnv = {
  PERSISTENCE: 'postgres',
  DATABASE_URL: 'postgres://db',
};

function testGlobals(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): DynamicModule {
  return {
    module: TestGlobalsModule,
    global: true,
    providers: [
      { provide: API_CONFIG, useValue: loadApiConfig(env) },
      ...(prisma === undefined
        ? []
        : [{ provide: IPrismaDb, useValue: prisma }]),
    ],
    exports: prisma === undefined ? [API_CONFIG] : [API_CONFIG, IPrismaDb],
  };
}

async function compile(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
) {
  return Test.createTestingModule({
    imports: [testGlobals(env, prisma), SecondFactorModule],
  }).compile();
}

describe('SecondFactorModule', () => {
  it('binds enrollments to Postgres when a Prisma client is configured', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(ISecondFactorEnrollmentRepository)).toBeInstanceOf(
      PrismaSecondFactorEnrollmentRepository,
    );
  });

  it('binds enrollments in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ISecondFactorEnrollmentRepository)).toBeInstanceOf(
      InMemorySecondFactorEnrollmentRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(ISecondFactorEnrollmentRepository)).toBeInstanceOf(
      InMemorySecondFactorEnrollmentRepository,
    );
  });

  it('binds the second factor codes to the time-based implementation', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ISecondFactorCodes)).toBeInstanceOf(
      TotpSecondFactorCodes,
    );
  });
});
