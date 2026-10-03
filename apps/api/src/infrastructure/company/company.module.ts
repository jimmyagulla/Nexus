import { Module } from '@nestjs/common';
import {
  CreateCompanyUseCase,
  UpdateCompanyNameUseCase,
  UpdateNonWorkingWeekdaysUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IAuditLogRepository,
  ICompanyRepository,
  ICreateCompanyInboundPort,
  IUpdateCompanyNameInboundPort,
  IUpdateNonWorkingWeekdaysInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanyController } from '../../adapters/http/company/company.controller';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { AuditLogModule } from '../audit/audit-log.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [AuditLogModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useFactory: (prisma: PrismaDb) => new PrismaCompanyRepository(prisma),
      inject: [IPrismaDb],
    },
    {
      provide: ICreateCompanyInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new CreateCompanyUseCase(companies),
      inject: [ICompanyRepository],
    },
    {
      provide: IUpdateCompanyNameInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new UpdateCompanyNameUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
    {
      provide: IUpdateNonWorkingWeekdaysInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new UpdateNonWorkingWeekdaysUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
  ],
  exports: [ICompanyRepository],
})
export class CompanyModule {}
