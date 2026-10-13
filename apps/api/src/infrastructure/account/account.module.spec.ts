import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryAccountRepository } from '@hexagonal-monorepo-template/adapters';
import { AccountStatus, UserRole } from '@hexagonal-monorepo-template/domain';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaAccountRepository } from '../../adapters/out/account/prisma-account.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { AccountModule } from './account.module';

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

async function accountRepository(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<IAccountRepository> {
  const moduleRef = await Test.createTestingModule({
    imports: [testGlobals(env, prisma), AccountModule],
  }).compile();

  return moduleRef.get<IAccountRepository>(IAccountRepository);
}

describe('AccountModule', () => {
  it('binds accounts to Postgres when a Prisma client is configured', async () => {
    const prisma = {} as unknown as PrismaDb;

    await expect(accountRepository(postgresEnv, prisma)).resolves.toBeInstanceOf(
      PrismaAccountRepository,
    );
  });

  it('binds accounts in memory when no persistence is configured', async () => {
    await expect(accountRepository({})).resolves.toBeInstanceOf(
      InMemoryAccountRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    await expect(accountRepository(postgresEnv)).resolves.toBeInstanceOf(
      InMemoryAccountRepository,
    );
  });

  it('seeds the local invited employer when authentication is disabled', async () => {
    const accounts = await accountRepository({ AUTH_DISABLED: 'true' });
    const [seeded] = await accounts.listByCompany('local-dev-company');

    expect(seeded?.id).toBe('local-dev-account');
    expect(seeded?.identifier.value).toBe('local-dev-user');
    expect(seeded?.role).toBe(UserRole.EMPLOYER);
    expect(seeded?.status).toBe(AccountStatus.INVITED);
  });
});
