import { Module } from '@nestjs/common';
import { PrismaAuditLogRepository } from '../../adapters/out/audit/prisma-audit-log.repository';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: IAuditLogRepository,
      useFactory: (prisma: PrismaDb) => new PrismaAuditLogRepository(prisma),
      inject: [IPrismaDb],
    },
  ],
  exports: [IAuditLogRepository],
})
export class AuditLogModule {}
