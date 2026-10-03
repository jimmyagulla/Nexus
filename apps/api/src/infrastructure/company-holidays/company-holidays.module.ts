import { Module } from '@nestjs/common';
import {
  AddCompanyHolidayUseCase,
  RemoveCompanyHolidayUseCase,
  UpdateCompanyHolidayUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IAddCompanyHolidayInboundPort,
  IAuditLogRepository,
  ICompanyRepository,
  IRemoveCompanyHolidayInboundPort,
  IUpdateCompanyHolidayInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanyHolidaysController } from '../../adapters/http/company-holidays/company-holidays.controller';
import { AuditLogModule } from '../audit/audit-log.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule, AuditLogModule],
  controllers: [CompanyHolidaysController],
  providers: [
    {
      provide: IAddCompanyHolidayInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new AddCompanyHolidayUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
    {
      provide: IUpdateCompanyHolidayInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new UpdateCompanyHolidayUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
    {
      provide: IRemoveCompanyHolidayInboundPort,
      useFactory: (
        companies: ICompanyRepository,
        auditLog: IAuditLogRepository,
      ) => new RemoveCompanyHolidayUseCase(companies, auditLog),
      inject: [ICompanyRepository, IAuditLogRepository],
    },
  ],
})
export class CompanyHolidaysModule {}
