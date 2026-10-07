import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryAuditLogRepository } from '@hexagonal-monorepo-template/adapters';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaAuditLogRepository } from '../../adapters/out/audit/prisma-audit-log.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { AuditModule } from './audit.module';

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

async function auditRepository(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<IAuditLogRepository> {
  const moduleRef = await Test.createTestingModule({
    imports: [testGlobals(env, prisma), AuditModule],
  }).compile();

  return moduleRef.get<IAuditLogRepository>(IAuditLogRepository);
}

describe('AuditModule', () => {
  it('binds the audit log to Postgres when a Prisma client is configured', async () => {
    const prisma = {} as unknown as PrismaDb;

    await expect(auditRepository(postgresEnv, prisma)).resolves.toBeInstanceOf(
      PrismaAuditLogRepository,
    );
  });

  it('binds the audit log in memory when no persistence is configured', async () => {
    await expect(auditRepository({})).resolves.toBeInstanceOf(
      InMemoryAuditLogRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    await expect(auditRepository(postgresEnv)).resolves.toBeInstanceOf(
      InMemoryAuditLogRepository,
    );
  });
});
