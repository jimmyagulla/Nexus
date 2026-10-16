import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  InMemoryDocumentFileStorage,
  InMemoryDocumentRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IDepositDocuments,
  IDocumentFileStorage,
  IDocumentRepository,
  IDownloadDocument,
  IListDocuments,
  IViewDocument,
} from '@hexagonal-monorepo-template/ports';
import { PrismaDocumentRepository } from '../../adapters/out/documents/prisma-document.repository';
import { SupabaseDocumentFileStorage } from '../../adapters/out/documents/supabase-document-file.storage';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { DocumentsModule } from './documents.module';

@Global()
@Module({})
class TestGlobalsModule {}

function testGlobals(env: Record<string, string | undefined>, prisma?: PrismaDb): DynamicModule {
  return {
    module: TestGlobalsModule,
    global: true,
    providers: [
      { provide: API_CONFIG, useValue: loadApiConfig(env) },
      ...(prisma === undefined ? [] : [{ provide: IPrismaDb, useValue: prisma }]),
    ],
    exports: prisma === undefined ? [API_CONFIG] : [API_CONFIG, IPrismaDb],
  };
}

function compile(env: Record<string, string | undefined>, prisma?: PrismaDb): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [testGlobals(env, prisma), ClockModule, DocumentsModule],
  }).compile();
}

describe('DocumentsModule', () => {
  it('wires the document use cases', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IListDocuments)).toBeDefined();
    expect(moduleRef.get(IDepositDocuments)).toBeDefined();
    expect(moduleRef.get(IViewDocument)).toBeDefined();
    expect(moduleRef.get(IDownloadDocument)).toBeDefined();
  });

  it('records documents in Postgres when the mode and the client are both set', async () => {
    const moduleRef = await compile({ PERSISTENCE: 'postgres', DATABASE_URL: 'postgres://db' }, {} as unknown as PrismaDb);

    expect(moduleRef.get(IDocumentRepository)).toBeInstanceOf(PrismaDocumentRepository);
  });

  it('records documents in memory when no persistence is configured', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IDocumentRepository)).toBeInstanceOf(InMemoryDocumentRepository);
  });

  it('keeps files in Supabase Storage when the project and its service key are set', async () => {
    const moduleRef = await compile({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'service' });

    expect(moduleRef.get(IDocumentFileStorage)).toBeInstanceOf(SupabaseDocumentFileStorage);
  });

  it('keeps files in memory without a Supabase project', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IDocumentFileStorage)).toBeInstanceOf(InMemoryDocumentFileStorage);
  });
});
