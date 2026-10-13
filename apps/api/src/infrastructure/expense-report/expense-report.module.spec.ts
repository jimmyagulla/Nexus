import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddExpense,
  ICreateExpenseReport,
  IExpenseReportRepository,
  IGetExpenseReport,
  IListExpenseReports,
  IRemoveExpense,
  IUpdateExpense,
} from '@hexagonal-monorepo-template/ports';
import { PrismaExpenseReportRepository } from '../../adapters/out/expense-report/prisma-expense-report.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { ExpenseReportModule } from './expense-report.module';

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
    imports: [testGlobals(env, prisma), ExpenseReportModule],
  }).compile();
}

describe('ExpenseReportModule', () => {
  it('wires the expense report use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ICreateExpenseReport)).toBeDefined();
    expect(moduleRef.get(IAddExpense)).toBeDefined();
    expect(moduleRef.get(IGetExpenseReport)).toBeDefined();
    expect(moduleRef.get(IListExpenseReports)).toBeDefined();
    expect(moduleRef.get(IUpdateExpense)).toBeDefined();
    expect(moduleRef.get(IRemoveExpense)).toBeDefined();
  });

  it('stores reports in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(IExpenseReportRepository)).toBeInstanceOf(
      PrismaExpenseReportRepository,
    );
  });

  it('stores reports in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IExpenseReportRepository)).toBeInstanceOf(
      InMemoryExpenseReportRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(IExpenseReportRepository)).toBeInstanceOf(
      InMemoryExpenseReportRepository,
    );
  });
});
