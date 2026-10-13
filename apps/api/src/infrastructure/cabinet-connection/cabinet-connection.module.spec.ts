import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryCabinetConnectionRepository,
  LOCAL_DEV_COMPANY_ID,
} from '@hexagonal-monorepo-template/adapters';
import { ICabinetConnectionRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaCabinetConnectionRepository } from '../../adapters/out/cabinet-connection/prisma-cabinet-connection.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { CabinetConnectionModule } from './cabinet-connection.module';

@Global()
@Module({})
class TestGlobalsModule {}

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

async function connections(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<ICabinetConnectionRepository> {
  const moduleRef = await Test.createTestingModule({
    imports: [testGlobals(env, prisma), CabinetConnectionModule],
  }).compile();
  return moduleRef.get<ICabinetConnectionRepository>(
    ICabinetConnectionRepository,
  );
}

describe('CabinetConnectionModule', () => {
  it('binds the connections to Postgres when a Prisma client is configured', async () => {
    await expect(
      connections(
        { PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' },
        {} as unknown as PrismaDb,
      ),
    ).resolves.toBeInstanceOf(PrismaCabinetConnectionRepository);
  });

  it('binds the connections in memory when no persistence is configured', async () => {
    await expect(connections({})).resolves.toBeInstanceOf(
      InMemoryCabinetConnectionRepository,
    );
  });

  it('starts without any connected cabinet in memory', async () => {
    const repository = await connections({});

    await expect(
      repository.findByCompanyId(LOCAL_DEV_COMPANY_ID),
    ).resolves.toBeNull();
  });

  it('connects a cabinet to the local development company when authentication is disabled', async () => {
    const repository = await connections({ AUTH_DISABLED: 'true' });

    expect(
      (await repository.findByCompanyId(LOCAL_DEV_COMPANY_ID))?.isConnected(),
    ).toBe(true);
  });
});
