import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryCabinetExchangeRepository,
  InMemoryExchangeFileStorage,
} from '@hexagonal-monorepo-template/adapters';
import {
  ICabinetExchangeRepository,
  ICreateCabinetExchangeDraft,
  IDownloadCabinetExchangeFile,
  IExchangeFileStorage,
  IListCabinetExchanges,
  IMarkCabinetExchangeToTransmit,
  IOpenCabinetExchange,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';
import { PrismaCabinetExchangeRepository } from '../../adapters/out/cabinet-exchange/prisma-cabinet-exchange.repository';
import { PrismaExchangeFileStorage } from '../../adapters/out/cabinet-exchange/prisma-exchange-file.storage';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { CabinetExchangeModule } from './cabinet-exchange.module';

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
    imports: [testGlobals(env, prisma), ClockModule, CabinetExchangeModule],
  }).compile();
}

describe('CabinetExchangeModule', () => {
  it('wires the cabinet exchange use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ICreateCabinetExchangeDraft)).toBeDefined();
    expect(moduleRef.get(IMarkCabinetExchangeToTransmit)).toBeDefined();
    expect(moduleRef.get(ITransmitCabinetExchanges)).toBeDefined();
    expect(moduleRef.get(IListCabinetExchanges)).toBeDefined();
    expect(moduleRef.get(IOpenCabinetExchange)).toBeDefined();
    expect(moduleRef.get(IDownloadCabinetExchangeFile)).toBeDefined();
  });

  it('stores exchanges and their files in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(ICabinetExchangeRepository)).toBeInstanceOf(
      PrismaCabinetExchangeRepository,
    );
    expect(moduleRef.get(IExchangeFileStorage)).toBeInstanceOf(
      PrismaExchangeFileStorage,
    );
  });

  it('stores exchanges and their files in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(ICabinetExchangeRepository)).toBeInstanceOf(
      InMemoryCabinetExchangeRepository,
    );
    expect(moduleRef.get(IExchangeFileStorage)).toBeInstanceOf(
      InMemoryExchangeFileStorage,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(ICabinetExchangeRepository)).toBeInstanceOf(
      InMemoryCabinetExchangeRepository,
    );
  });
});
