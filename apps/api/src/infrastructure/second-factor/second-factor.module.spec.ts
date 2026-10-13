import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  CryptoRecoveryCodes,
  InMemorySecondFactorIdentityBinder,
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  IBeginSecondFactorEnrollment,
  IConfirmSecondFactorEnrollment,
  IOpenSecondFactorChallenge,
  IRecoveryCodes,
  ISecondFactorCodes,
  ISecondFactorIdentityBinder,
  ISecondFactorRepository,
  IVerifySecondFactor,
} from '@hexagonal-monorepo-template/ports';
import { SupabaseSecondFactorIdentityBinder } from '../../adapters/out/identity/supabase-second-factor-identity-binder';
import { PrismaSecondFactorRepository } from '../../adapters/out/second-factor/prisma-second-factor.repository';
import { ClockModule } from '../clock/clock.module';
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

function compile(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [testGlobals(env, prisma), ClockModule, SecondFactorModule],
  }).compile();
}

describe('SecondFactorModule', () => {
  it('wires the enrollment use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IBeginSecondFactorEnrollment)).toBeDefined();
    expect(moduleRef.get(IConfirmSecondFactorEnrollment)).toBeDefined();
  });

  it('wires the challenge use case', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IOpenSecondFactorChallenge)).toBeDefined();
  });

  it('carries the verification through Supabase when the service role is configured', async () => {
    const moduleRef = await compile({
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
    });

    expect(moduleRef.get(ISecondFactorIdentityBinder)).toBeInstanceOf(
      SupabaseSecondFactorIdentityBinder,
    );
  });

  it('carries the verification in memory without the service role', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ISecondFactorIdentityBinder)).toBeInstanceOf(
      InMemorySecondFactorIdentityBinder,
    );
  });

  it('wires the verification use case', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IVerifySecondFactor)).toBeDefined();
  });

  it('issues recovery codes from random bytes', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IRecoveryCodes)).toBeInstanceOf(CryptoRecoveryCodes);
  });

  it('issues time based codes', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ISecondFactorCodes)).toBeInstanceOf(
      TotpSecondFactorCodes,
    );
  });

  it('stores second factors in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(ISecondFactorRepository)).toBeInstanceOf(
      PrismaSecondFactorRepository,
    );
  });

  it('stores second factors in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ISecondFactorRepository)).toBeInstanceOf(
      InMemorySecondFactorRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(ISecondFactorRepository)).toBeInstanceOf(
      InMemorySecondFactorRepository,
    );
  });
});
