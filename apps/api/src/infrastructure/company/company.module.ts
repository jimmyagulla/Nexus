import { Module } from '@nestjs/common';
import { CompanyController } from '../../adapters/http/company/company.controller';
import { PrismaAuditLogRepository } from '../../adapters/out/audit/prisma-audit-log.repository';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { CreateCompanyUseCase } from '@hexagonal-monorepo-template/application';
import { GetCompanySettingsUseCase } from '@hexagonal-monorepo-template/application';
import { UpdateCompanySettingsUseCase } from '@hexagonal-monorepo-template/application';
import {
  IAuditLogRepository,
  ICompanyRepository,
  ICreateCompanyInboundPort,
  IGetCompanySettingsInboundPort,
  IUpdateCompanySettingsInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useFactory: (prisma: PrismaDb) => new PrismaCompanyRepository(prisma),
      inject: [IPrismaDb],
    },
    {
      provide: IAuditLogRepository,
      useFactory: (prisma: PrismaDb) => new PrismaAuditLogRepository(prisma),
      inject: [IPrismaDb],
    },
    {
      provide: ICreateCompanyInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new CreateCompanyUseCase(companies),
      inject: [ICompanyRepository],
    },
    {
      provide: IGetCompanySettingsInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new GetCompanySettingsUseCase(companies),
      inject: [ICompanyRepository],
    },
    {
      provide: IUpdateCompanySettingsInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new UpdateCompanySettingsUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
  ],
})
export class CompanyModule {}
