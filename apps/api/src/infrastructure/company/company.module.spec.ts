import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryCompanyIdentityBinder,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  ICompanyIdentityBinder,
  ICompanyRepository,
  ICreateCompany,
  IRenameCompany,
} from '@hexagonal-monorepo-template/ports';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { SupabaseCompanyIdentityBinder } from '../../adapters/out/identity/supabase-company-identity-binder';
import { ClockModule } from '../clock/clock.module';
import { IdGeneratorModule } from '../id-generator/id-generator.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { CompanyModule } from './company.module';

@Global()
@Module({})
class TestGlobalsModule {}

const postgresEnv = {
  PERSISTENCE: 'postgres',
  DATABASE_URL: 'postgres://db',
};

const supabaseEnv = {
  SUPABASE_URL: 'https://project.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
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
      CompanyModule,
    ],
  }).compile();
}

describe('CompanyModule', () => {
  it('wires the company use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ICreateCompany)).toBeDefined();
    expect(moduleRef.get(IRenameCompany)).toBeDefined();
  });

  it('creates the first invited employer when a company is opened', async () => {
    const moduleRef = await compile({});
    const create = moduleRef.get<ICreateCompany>(ICreateCompany);
    const accounts = moduleRef.get<IAccountRepository>(IAccountRepository);

    const company = await create.execute({
      actor: { userId: 'user-1', companyId: null, role: null },
      name: 'Acme',
    });
    const attached = await accounts.listByCompany(company.id);

    expect(attached).toHaveLength(1);
    expect(attached[0]?.identifier.value).toBe('user-1');
    expect(attached[0]?.role).toBe(UserRole.EMPLOYER);
    expect(attached[0]?.status).toBe(AccountStatus.INVITED);
  });

  it('stores companies in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(ICompanyRepository)).toBeInstanceOf(
      PrismaCompanyRepository,
    );
  });

  it('seeds the local company when authentication is disabled', async () => {
    const moduleRef = await compile({ AUTH_DISABLED: 'true' });

    await expect(
      moduleRef.get(ICompanyRepository).findById('local-dev-company'),
    ).resolves.toMatchObject({ id: 'local-dev-company' });
  });

  it('stores companies in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ICompanyRepository)).toBeInstanceOf(
      InMemoryCompanyRepository,
    );
  });

  it('ignores an available Prisma client while the mode stays memory', async () => {
    const moduleRef = await compile({}, {} as unknown as PrismaDb);

    expect(moduleRef.get(ICompanyRepository)).toBeInstanceOf(
      InMemoryCompanyRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(ICompanyRepository)).toBeInstanceOf(
      InMemoryCompanyRepository,
    );
  });

  it('binds identities through Supabase when the service role is configured', async () => {
    const moduleRef = await compile(supabaseEnv);

    expect(moduleRef.get(ICompanyIdentityBinder)).toBeInstanceOf(
      SupabaseCompanyIdentityBinder,
    );
  });

  it.each([
    ['service role key', { SUPABASE_URL: supabaseEnv.SUPABASE_URL }],
    [
      'project url',
      { SUPABASE_SERVICE_ROLE_KEY: supabaseEnv.SUPABASE_SERVICE_ROLE_KEY },
    ],
    ['whole configuration', {}],
  ])('binds identities in memory without the %s', async (_label, env) => {
    const moduleRef = await compile(env);

    expect(moduleRef.get(ICompanyIdentityBinder)).toBeInstanceOf(
      InMemoryCompanyIdentityBinder,
    );
  });

});
