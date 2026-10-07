import { Module } from '@nestjs/common';
import {
  GetCompanySettingsUseCase,
  SetNonWorkingWeekdaysUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IGetCompanySettings,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/http/company-settings/company-settings.controller';
import { AuditModule } from '../audit/audit.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule, AuditModule],
  controllers: [CompanySettingsController],
  providers: [
    {
      provide: IGetCompanySettings,
      useFactory: (companies: ICompanyRepository) =>
        new GetCompanySettingsUseCase(companies),
      inject: [ICompanyRepository],
    },
    {
      provide: ISetNonWorkingWeekdays,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        clock: IClock,
      ) => new SetNonWorkingWeekdaysUseCase(companies, audits, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IClock],
    },
  ],
})
export class CompanySettingsModule {}
