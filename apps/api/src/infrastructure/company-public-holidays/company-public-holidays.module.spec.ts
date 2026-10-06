import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryPublicHolidayRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddCompanyPublicHoliday,
  IPublicHolidayRepository,
  IRemoveCompanyPublicHoliday,
  IUpdateCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';
import { PrismaPublicHolidayRepository } from '../../adapters/out/public-holiday/prisma-public-holiday.repository';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IdGeneratorModule } from '../id/id-generator.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { CompanyPublicHolidaysModule } from './company-public-holidays.module';

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

function compile(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      testGlobals(env, prisma),
      ClockModule,
      IdGeneratorModule,
      CompanyPublicHolidaysModule,
    ],
  }).compile();
}

describe('CompanyPublicHolidaysModule', () => {
  it('wires the public holiday use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IAddCompanyPublicHoliday)).toBeDefined();
    expect(moduleRef.get(IUpdateCompanyPublicHoliday)).toBeDefined();
    expect(moduleRef.get(IRemoveCompanyPublicHoliday)).toBeDefined();
  });

  it('stores public holidays in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(IPublicHolidayRepository)).toBeInstanceOf(
      PrismaPublicHolidayRepository,
    );
  });

  it('stores public holidays in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IPublicHolidayRepository)).toBeInstanceOf(
      InMemoryPublicHolidayRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(IPublicHolidayRepository)).toBeInstanceOf(
      InMemoryPublicHolidayRepository,
    );
  });
});
