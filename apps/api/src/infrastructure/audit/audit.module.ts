import { Module } from '@nestjs/common';
import { InMemoryAuditLogRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAuditLogRepository,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';
import { PrismaAuditLogRepository } from '../../adapters/out/audit/prisma-audit-log.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: IAuditLogRepository,
      useFactory: (config: ApiConfig, ids: IIdGenerator, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaAuditLogRepository(prisma);
        }
        return new InMemoryAuditLogRepository(ids);
      },
      inject: [API_CONFIG, IIdGenerator, { token: IPrismaDb, optional: true }],
    },
  ],
  exports: [IAuditLogRepository],
})
export class AuditModule {}
