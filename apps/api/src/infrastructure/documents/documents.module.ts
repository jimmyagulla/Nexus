import { Module } from '@nestjs/common';
import {
  DepositDocumentsUseCase,
  DownloadDocumentUseCase,
  ListDocumentsUseCase,
  ViewDocumentUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryDocumentFileStorage,
  InMemoryDocumentRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IClock,
  IDepositDocuments,
  IDocumentFileStorage,
  IDocumentRepository,
  IDownloadDocument,
  IIdGenerator,
  IListDocuments,
  IViewDocument,
} from '@hexagonal-monorepo-template/ports';
import { DocumentsController } from '../../adapters/http/documents/documents.controller';
import { PrismaDocumentRepository } from '../../adapters/out/documents/prisma-document.repository';
import { SupabaseDocumentFileStorage } from '../../adapters/out/documents/supabase-document-file.storage';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [DocumentsController],
  providers: [
    {
      provide: IDocumentRepository,
      useFactory: (config: ApiConfig, ids: IIdGenerator, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaDocumentRepository(prisma);
        }
        return new InMemoryDocumentRepository(ids);
      },
      inject: [API_CONFIG, IIdGenerator, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IDocumentFileStorage,
      useFactory: (config: ApiConfig, ids: IIdGenerator) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabaseDocumentFileStorage(
            {
              url: config.supabaseUrl,
              serviceRoleKey: config.supabaseServiceRoleKey,
            },
            ids,
          );
        }
        return new InMemoryDocumentFileStorage(ids);
      },
      inject: [API_CONFIG, IIdGenerator],
    },
    {
      provide: IListDocuments,
      useFactory: (documents: IDocumentRepository) =>
        new ListDocumentsUseCase(documents),
      inject: [IDocumentRepository],
    },
    {
      provide: IDepositDocuments,
      useFactory: (
        documents: IDocumentRepository,
        files: IDocumentFileStorage,
        clock: IClock,
      ) => new DepositDocumentsUseCase(documents, files, clock),
      inject: [IDocumentRepository, IDocumentFileStorage, IClock],
    },
    {
      provide: IViewDocument,
      useFactory: (documents: IDocumentRepository, files: IDocumentFileStorage) =>
        new ViewDocumentUseCase(documents, files),
      inject: [IDocumentRepository, IDocumentFileStorage],
    },
    {
      provide: IDownloadDocument,
      useFactory: (documents: IDocumentRepository, files: IDocumentFileStorage) =>
        new DownloadDocumentUseCase(documents, files),
      inject: [IDocumentRepository, IDocumentFileStorage],
    },
  ],
})
export class DocumentsModule {}
