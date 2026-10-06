import { Module } from '@nestjs/common';
import {
  AddCompanyPublicHolidayUseCase,
  CreateCompanyUseCase,
  GetCompanySettingsUseCase,
  RemoveCompanyPublicHolidayUseCase,
  RenameCompanyUseCase,
  SetNonWorkingWeekdaysUseCase,
  UpdateCompanyPublicHolidayUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryAuditLogRepository,
  InMemoryCompanyIdentityBinder,
  InMemoryCompanyRepository,
  InMemoryPublicHolidayRepository,
  SystemClock,
  UuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  IAddCompanyPublicHoliday,
  IAuditLogRepository,
  IClock,
  ICompanyIdentityBinder,
  ICompanyRepository,
  ICreateCompany,
  IGetCompanySettings,
  IIdGenerator,
  IPublicHolidayRepository,
  IRemoveCompanyPublicHoliday,
  IRenameCompany,
  ISetNonWorkingWeekdays,
  IUpdateCompanyPublicHoliday,
} from '@hexagonal-monorepo-template/ports';
import { CompanyController } from '../../adapters/http/company/company.controller';
import { CompanyPublicHolidaysController } from '../../adapters/http/company-public-holidays/company-public-holidays.controller';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { PrismaPublicHolidayRepository } from '../../adapters/out/public-holiday/prisma-public-holiday.repository';
import { PrismaAuditLogRepository } from '../../adapters/out/audit/prisma-audit-log.repository';
import { SupabaseCompanyIdentityBinder } from '../../adapters/out/identity/supabase-company-identity-binder';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [CompanyController, CompanyPublicHolidaysController],
  providers: [
    {
      provide: IClock,
      useFactory: () => new SystemClock(),
    },
    {
      provide: IIdGenerator,
      useFactory: () => new UuidGenerator(),
    },
    {
      provide: ICompanyRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaCompanyRepository(prisma);
        }
        return new InMemoryCompanyRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
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
      provide: IAuditLogRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaAuditLogRepository(prisma);
        }
        return new InMemoryAuditLogRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: ICompanyIdentityBinder,
      useFactory: (config: ApiConfig) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabaseCompanyIdentityBinder(
            config.supabaseUrl,
            config.supabaseServiceRoleKey,
          );
        }
        return new InMemoryCompanyIdentityBinder();
      },
      inject: [API_CONFIG],
    },
    {
      provide: ICreateCompany,
      useFactory: (
        companies: ICompanyRepository,
        ids: IIdGenerator,
        identity: ICompanyIdentityBinder,
      ) => new CreateCompanyUseCase(companies, ids, identity),
      inject: [ICompanyRepository, IIdGenerator, ICompanyIdentityBinder],
    },
    {
      provide: IGetCompanySettings,
      useFactory: (companies: ICompanyRepository) =>
        new GetCompanySettingsUseCase(companies),
      inject: [ICompanyRepository],
    },
    {
      provide: IRenameCompany,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        ids: IIdGenerator,
        clock: IClock,
      ) => new RenameCompanyUseCase(companies, audits, ids, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IIdGenerator, IClock],
    },
    {
      provide: ISetNonWorkingWeekdays,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        ids: IIdGenerator,
        clock: IClock,
      ) => new SetNonWorkingWeekdaysUseCase(companies, audits, ids, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IIdGenerator, IClock],
    },
    {
      provide: IAddCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        publicHolidays: IPublicHolidayRepository,
        audits: IAuditLogRepository,
        ids: IIdGenerator,
        clock: IClock,
      ) =>
        new AddCompanyPublicHolidayUseCase(
          companies,
          publicHolidays,
          audits,
          ids,
          clock,
        ),
      inject: [
        ICompanyRepository,
        IPublicHolidayRepository,
        IAuditLogRepository,
        IIdGenerator,
        IClock,
      ],
    },
    {
      provide: IUpdateCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        publicHolidays: IPublicHolidayRepository,
        audits: IAuditLogRepository,
        ids: IIdGenerator,
        clock: IClock,
      ) =>
        new UpdateCompanyPublicHolidayUseCase(
          companies,
          publicHolidays,
          audits,
          ids,
          clock,
        ),
      inject: [
        ICompanyRepository,
        IPublicHolidayRepository,
        IAuditLogRepository,
        IIdGenerator,
        IClock,
      ],
    },
    {
      provide: IRemoveCompanyPublicHoliday,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        ids: IIdGenerator,
        clock: IClock,
      ) => new RemoveCompanyPublicHolidayUseCase(companies, audits, ids, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IIdGenerator, IClock],
    },
  ],
})
export class CompanyModule {}
