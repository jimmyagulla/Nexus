import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryNotificationRepository } from '@hexagonal-monorepo-template/adapters';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaNotificationRepository } from '../../adapters/out/notification/prisma-notification.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { NotificationModule } from './notification.module';

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
    imports: [testGlobals(env, prisma), NotificationModule],
  }).compile();
}

describe('NotificationModule', () => {
  it('stores notifications in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile(postgresEnv, {} as unknown as PrismaDb);

    expect(moduleRef.get(INotificationRepository)).toBeInstanceOf(
      PrismaNotificationRepository,
    );
  });

  it('stores notifications in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(INotificationRepository)).toBeInstanceOf(
      InMemoryNotificationRepository,
    );
  });

  it('falls back to memory when Postgres is configured without a client', async () => {
    const moduleRef = await compile(postgresEnv);

    expect(moduleRef.get(INotificationRepository)).toBeInstanceOf(
      InMemoryNotificationRepository,
    );
  });
});
