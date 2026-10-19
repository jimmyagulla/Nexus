import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryExpenseReportProofStorage,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IChangeExpenseReportStatus,
  IExpenseReportProofStorage,
  IExpenseReportRepository,
  IListEmployeeExpenseReports,
  IListExpenseReports,
  IReviseExpenseReport,
  ISubmitExpenseReport,
  IViewExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';
import { PrismaExpenseReportRepository } from '../../adapters/out/expense-reports/prisma-expense-report.repository';
import { SupabaseExpenseReportProofStorage } from '../../adapters/out/expense-reports/supabase-expense-report-proof.storage';
import { ClockModule } from '../clock/clock.module';
import { IdGeneratorModule } from '../id/id-generator.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { ExpenseReportsModule } from './expense-reports.module';

@Global()
@Module({})
class TestGlobalsModule {}

function testGlobals(env: Record<string, string | undefined>, prisma?: PrismaDb): DynamicModule {
  return {
    module: TestGlobalsModule,
    global: true,
    providers: [
      { provide: API_CONFIG, useValue: loadApiConfig(env) },
      ...(prisma === undefined ? [] : [{ provide: IPrismaDb, useValue: prisma }]),
    ],
    exports: prisma === undefined ? [API_CONFIG] : [API_CONFIG, IPrismaDb],
  };
}

function compile(env: Record<string, string | undefined>, prisma?: PrismaDb): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [testGlobals(env, prisma), ClockModule, IdGeneratorModule, ExpenseReportsModule],
  }).compile();
}

describe('ExpenseReportsModule', () => {
  it('wires the expense report use cases', async () => {
    const moduleRef = await compile({});

    expect([
      IListExpenseReports, IListEmployeeExpenseReports, ISubmitExpenseReport,
      IReviseExpenseReport, IViewExpenseReportProof, IChangeExpenseReportStatus,
    ].every((token) => moduleRef.get(token) !== undefined)).toBe(true);
  });

  it('records expense reports in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile({ PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' }, {} as unknown as PrismaDb);

    expect(moduleRef.get(IExpenseReportRepository)).toBeInstanceOf(PrismaExpenseReportRepository);
  });

  it('records expense reports in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IExpenseReportRepository)).toBeInstanceOf(InMemoryExpenseReportRepository);
  });

  it('keeps receipts in Supabase Storage when the project and its service key are set', async () => {
    const moduleRef = await compile({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'service' });

    expect(moduleRef.get(IExpenseReportProofStorage)).toBeInstanceOf(SupabaseExpenseReportProofStorage);
  });

  it('keeps receipts in memory without a Supabase project', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IExpenseReportProofStorage)).toBeInstanceOf(InMemoryExpenseReportProofStorage);
  });
});
