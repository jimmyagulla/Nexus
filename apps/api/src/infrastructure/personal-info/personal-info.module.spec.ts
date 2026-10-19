import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryPersonalInfoRepository,
  SystemClock,
} from '@hexagonal-monorepo-template/adapters';
import {
  IClock,
  IGetPersonalInfo,
  IPersonalInfoRepository,
  IUpdatePersonalContact,
} from '@hexagonal-monorepo-template/ports';
import { PrismaPersonalInfoRepository } from '../../adapters/out/personal-info/prisma-personal-info.repository';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { PersonalInfoModule } from './personal-info.module';

@Global()
@Module({})
class TestGlobalsModule {}

function testGlobals(env: Record<string, string | undefined>, prisma?: PrismaDb): DynamicModule {
  return {
    module: TestGlobalsModule,
    global: true,
    providers: [
      { provide: API_CONFIG, useValue: loadApiConfig(env) },
      { provide: IClock, useValue: new SystemClock() },
      ...(prisma === undefined ? [] : [{ provide: IPrismaDb, useValue: prisma }]),
    ],
    exports: prisma === undefined ? [API_CONFIG, IClock] : [API_CONFIG, IClock, IPrismaDb],
  };
}

function compile(env: Record<string, string | undefined>, prisma?: PrismaDb): Promise<TestingModule> {
  return Test.createTestingModule({ imports: [testGlobals(env, prisma), PersonalInfoModule] }).compile();
}

describe('PersonalInfoModule', () => {
  it('wires the personal information use cases', async () => {
    const moduleRef = await compile({});

    expect([IGetPersonalInfo, IUpdatePersonalContact].map((port) => moduleRef.get(port))).not.toContain(undefined);
  });

  it('reads the information from Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile({ PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' }, {} as unknown as PrismaDb);

    expect(moduleRef.get(IPersonalInfoRepository)).toBeInstanceOf(PrismaPersonalInfoRepository);
  });

  it('reads the information from memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IPersonalInfoRepository)).toBeInstanceOf(InMemoryPersonalInfoRepository);
  });
});
