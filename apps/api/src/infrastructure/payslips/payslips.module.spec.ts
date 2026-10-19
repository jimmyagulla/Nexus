import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryPayslipFileStorage,
  InMemoryPayslipRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IDownloadPayslip,
  IExportPayslips,
  IListPayslips,
  IPayslipFileStorage,
  IPayslipRepository,
  IViewPayslip,
} from '@hexagonal-monorepo-template/ports';
import { PrismaPayslipRepository } from '../../adapters/out/payslips/prisma-payslip.repository';
import { SupabasePayslipFileStorage } from '../../adapters/out/payslips/supabase-payslip-file.storage';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { PayslipsModule } from './payslips.module';

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
  return Test.createTestingModule({ imports: [testGlobals(env, prisma), PayslipsModule] }).compile();
}

describe('PayslipsModule', () => {
  it('wires the payslip use cases', async () => {
    const moduleRef = await compile({});

    expect([IListPayslips, IViewPayslip, IDownloadPayslip, IExportPayslips].map((port) => moduleRef.get(port))).not.toContain(undefined);
  });

  it('reads payslips from Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile({ PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' }, {} as unknown as PrismaDb);

    expect(moduleRef.get(IPayslipRepository)).toBeInstanceOf(PrismaPayslipRepository);
  });

  it('reads payslips from memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IPayslipRepository)).toBeInstanceOf(InMemoryPayslipRepository);
  });

  it('links to files in Supabase Storage when the project and its service key are set', async () => {
    const moduleRef = await compile({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'service' });

    expect(moduleRef.get(IPayslipFileStorage)).toBeInstanceOf(SupabasePayslipFileStorage);
  });

  it('links to files in memory without a Supabase project', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IPayslipFileStorage)).toBeInstanceOf(InMemoryPayslipFileStorage);
  });
});
