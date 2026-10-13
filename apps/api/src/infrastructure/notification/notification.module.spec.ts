import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
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

async function repository(
  env: Record<string, string | undefined>,
  prisma?: PrismaDb,
): Promise<INotificationRepository> {
  const moduleRef = await Test.createTestingModule({
    imports: [testGlobals(env, prisma), NotificationModule],
  }).compile();
  return moduleRef.get<INotificationRepository>(INotificationRepository);
}

describe('NotificationModule', () => {
  it('binds the notifications to Postgres when a Prisma client is configured', async () => {
    await expect(
      repository(
        { PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' },
        {} as unknown as PrismaDb,
      ),
    ).resolves.toBeInstanceOf(PrismaNotificationRepository);
  });

  it('binds the notifications in memory when no persistence is configured', async () => {
    await expect(repository({})).resolves.toBeInstanceOf(
      InMemoryNotificationRepository,
    );
  });
});
