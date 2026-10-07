import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from './prisma-db.port';
import { PrismaModule } from './prisma.module';

const INJECTED_DB = Symbol('INJECTED_DB');

@Global()
@Module({})
class TestConfigModule {}

const testConfig: DynamicModule = {
  module: TestConfigModule,
  global: true,
  providers: [
    {
      provide: API_CONFIG,
      useValue: loadApiConfig({
        PERSISTENCE: 'postgres',
        DATABASE_URL: 'postgresql://user:secret@localhost:5432/nexus',
      }),
    },
  ],
  exports: [API_CONFIG],
};

@Module({
  providers: [
    {
      provide: INJECTED_DB,
      useFactory: (prisma: PrismaDb) => prisma,
      inject: [IPrismaDb],
    },
  ],
})
class DbConsumerModule {}

let clients: PrismaDb[] = [];

async function resolveDb(): Promise<{
  fromPort: PrismaDb;
  injected: PrismaDb;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [testConfig, PrismaModule, DbConsumerModule],
  }).compile();

  const fromPort = moduleRef.get<PrismaDb>(IPrismaDb);
  clients.push(fromPort);
  return { fromPort, injected: moduleRef.get<PrismaDb>(INJECTED_DB) };
}

describe('PrismaModule', () => {
  afterEach(async () => {
    await Promise.all(clients.map((client) => client.$disconnect()));
    clients = [];
  });

  it('binds the database port to a client covering the schema models', async () => {
    const { fromPort } = await resolveDb();

    expect(typeof fromPort.$transaction).toBe('function');
    expect(typeof fromPort.company.findUnique).toBe('function');
    expect(typeof fromPort.publicHoliday.upsert).toBe('function');
    expect(typeof fromPort.auditEvent.create).toBe('function');
  });

  it('offers the same client to a module that does not import it', async () => {
    const { fromPort, injected } = await resolveDb();

    expect(injected === fromPort).toBe(true);
  });
});
