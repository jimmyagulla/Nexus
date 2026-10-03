import { Module } from '@nestjs/common';
import {
  AddCompanyHolidayUseCase,
  GetCompanySettingsUseCase,
  RemoveCompanyHolidayUseCase,
  UpdateCompanyHolidayUseCase,
  UpdateCompanyNameUseCase,
  UpdateNonWorkingWeekdaysUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IAddCompanyHolidayInboundPort,
  IAuditLogRepository,
  ICompanyRepository,
  IGetCompanySettingsInboundPort,
  IRemoveCompanyHolidayInboundPort,
  IUpdateCompanyHolidayInboundPort,
  IUpdateCompanyNameInboundPort,
  IUpdateNonWorkingWeekdaysInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/http/company-settings/company-settings.controller';
import { AuditLogModule } from '../audit/audit-log.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule, AuditLogModule],
  controllers: [CompanySettingsController],
  providers: [
    {
      provide: IGetCompanySettingsInboundPort,
      useFactory: (companies: ICompanyRepository) =>
        new GetCompanySettingsUseCase(companies),
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
export class CompanySettingsModule {}
