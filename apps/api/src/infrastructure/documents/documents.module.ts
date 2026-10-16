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
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaDocumentRepository(prisma);
        }
        return new InMemoryDocumentRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IDocumentFileStorage,
      useFactory: (config: ApiConfig) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabaseDocumentFileStorage({
            url: config.supabaseUrl,
            serviceRoleKey: config.supabaseServiceRoleKey,
          });
        }
        return new InMemoryDocumentFileStorage();
      },
      inject: [API_CONFIG],
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
