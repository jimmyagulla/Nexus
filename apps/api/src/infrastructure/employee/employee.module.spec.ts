import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InviteEmployeeUseCase } from '@hexagonal-monorepo-template/application';
import { InMemoryEmployeeRepository } from '@hexagonal-monorepo-template/adapters';
import { EmployeeStatus } from '@hexagonal-monorepo-template/domain';
import {
  IEmployeeRepository,
  IInviteEmployee,
} from '@hexagonal-monorepo-template/ports';
import { PrismaEmployeeRepository } from '../../adapters/out/employee/prisma-employee.repository';
import { AccountModule } from '../account/account.module';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IdGeneratorModule } from '../id-generator/id-generator.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { EmployeeModule } from './employee.module';

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

async function compile(env: Record<string, string | undefined>, prisma?: PrismaDb) {
  return Test.createTestingModule({
    imports: [
      testGlobals(env, prisma),
      ClockModule,
      IdGeneratorModule,
      AccountModule,
      EmployeeModule,
    ],
  }).compile();
}

describe('EmployeeModule', () => {
  it('binds employee records to Postgres when a Prisma client is configured', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(IEmployeeRepository)).toBeInstanceOf(
      PrismaEmployeeRepository,
    );
  });

  it('binds employee records in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IEmployeeRepository)).toBeInstanceOf(
      InMemoryEmployeeRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(IEmployeeRepository)).toBeInstanceOf(
      InMemoryEmployeeRepository,
    );
  });

  it('wires the invitation use case', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IInviteEmployee)).toBeInstanceOf(InviteEmployeeUseCase);
  });

  it('seeds the local active employee when authentication is disabled', async () => {
    const moduleRef = await compile({ AUTH_DISABLED: 'true' });
    const employees = moduleRef.get<IEmployeeRepository>(IEmployeeRepository);

    const seeded = await employees.findById('local-dev-employee');

    expect(seeded?.companyId).toBe('local-dev-company');
    expect(seeded?.status).toBe(EmployeeStatus.ACTIVE);
  });
});
