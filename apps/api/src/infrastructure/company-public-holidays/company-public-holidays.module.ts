import { Module } from '@nestjs/common';
import {
  AddCompanyPublicHolidayUseCase,
  RemoveCompanyPublicHolidayUseCase,
  UpdateCompanyPublicHolidayUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryPublicHolidayRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddCompanyPublicHoliday,
  IAuditLogRepository,
  IClock,
  ICompanyRepository,
  IPublicHolidayRepository,
  IRemoveCompanyPublicHoliday,
  IUpdateCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';
import { CompanyPublicHolidaysController } from '../../adapters/http/company-public-holidays/company-public-holidays.controller';
import { PrismaPublicHolidayRepository } from '../../adapters/out/public-holiday/prisma-public-holiday.repository';
import { AuditModule } from '../audit/audit.module';
import { CompanyModule } from '../company/company.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [CompanyModule, AuditModule],
  controllers: [CompanyPublicHolidaysController],
  providers: [
    {
      provide: IPublicHolidayRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaPublicHolidayRepository(prisma);
        }
        return new InMemoryPublicHolidayRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IAddCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        publicHolidays: IPublicHolidayRepository,
        audits: IAuditLogRepository,
        clock: IClock,
      ) =>
        new AddCompanyPublicHolidayUseCase(
          companies,
          publicHolidays,
          audits,
          clock,
        ),
      inject: [
        ICompanyRepository,
        IPublicHolidayRepository,
        IAuditLogRepository,
        IClock,
      ],
    },
    {
      provide: IUpdateCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        publicHolidays: IPublicHolidayRepository,
        audits: IAuditLogRepository,
        clock: IClock,
      ) =>
        new UpdateCompanyPublicHolidayUseCase(
          companies,
          publicHolidays,
          audits,
          clock,
        ),
      inject: [
        ICompanyRepository,
        IPublicHolidayRepository,
        IAuditLogRepository,
        IClock,
      ],
    },
    {
      provide: IRemoveCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        clock: IClock,
      ) => new RemoveCompanyPublicHolidayUseCase(companies, audits, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IClock],
    },
  ],
})
export class CompanyPublicHolidaysModule {}
