import { Module } from '@nestjs/common';
import {
  CreateCompanyUseCase,
  RenameCompanyUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryCompanyIdentityBinder,
  InMemoryCompanyRepository,
  localDevCompany,
} from '@hexagonal-monorepo-template/adapters';
import {
  IAuditLogRepository,
  IClock,
  ICompanyIdentityBinder,
  ICompanyRepository,
  ICreateCompany,
  IRenameCompany,
} from '@hexagonal-monorepo-template/ports';
import { CompanyController } from '../../adapters/http/company/company.controller';
import { PrismaCompanyRepository } from '../../adapters/out/company/prisma-company.repository';
import { SupabaseCompanyIdentityBinder } from '../../adapters/out/identity/supabase-company-identity-binder';
import { AuditModule } from '../audit/audit.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [AuditModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaCompanyRepository(prisma);
        }
        if (config.authDisabled) {
          const company = localDevCompany();
          return new InMemoryCompanyRepository(
            new Map([[company.id, company]]),
          );
        }
        return new InMemoryCompanyRepository();
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
          return new SupabaseCompanyIdentityBinder({
            url: config.supabaseUrl,
            serviceRoleKey: config.supabaseServiceRoleKey,
          });
        }
        return new InMemoryCompanyIdentityBinder();
      },
      inject: [API_CONFIG],
    },
    {
      provide: ICreateCompany,
      useFactory: (
        companies: ICompanyRepository,
        identity: ICompanyIdentityBinder,
      ) => new CreateCompanyUseCase(companies, identity),
      inject: [ICompanyRepository, ICompanyIdentityBinder],
    },
    {
      provide: IRenameCompany,
      useFactory: (
        companies: ICompanyRepository,
        audits: IAuditLogRepository,
        clock: IClock,
      ) => new RenameCompanyUseCase(companies, audits, clock),
      inject: [ICompanyRepository, IAuditLogRepository, IClock],
    },
  ],
  exports: [ICompanyRepository],
})
export class CompanyModule {}
