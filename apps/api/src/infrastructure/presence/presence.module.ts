import { Module } from '@nestjs/common';
import {
  ListPresencesUseCase,
  OpenPresenceUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryPresenceRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAbsenceFactSource,
  ICompanyRepository,
  IEmployeeDirectory,
  IHoursFactSource,
  IListPresences,
  IOpenPresence,
  IPresenceRepository,
  ISickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/ports';
import { PresenceController } from '../../adapters/http/presence/presence.controller';
import { PrismaPresenceRepository } from '../../adapters/out/presence/prisma-presence.repository';
import { AbsenceFactSourceModule } from '../absence-fact-source/absence-fact-source.module';
import { CompanyModule } from '../company/company.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { EmployeeDirectoryModule } from '../employee-directory/employee-directory.module';
import { HoursFactSourceModule } from '../hours-fact-source/hours-fact-source.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';
import { SickLeaveDocumentSourceModule } from '../sick-leave-document-source/sick-leave-document-source.module';

@Module({
  imports: [
    CompanyModule,
    EmployeeDirectoryModule,
    AbsenceFactSourceModule,
    SickLeaveDocumentSourceModule,
    HoursFactSourceModule,
  ],
  controllers: [PresenceController],
  providers: [
    {
      provide: IPresenceRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaPresenceRepository(prisma);
        }
        return new InMemoryPresenceRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IOpenPresence,
      useFactory: (
        companies: ICompanyRepository,
        employees: IEmployeeDirectory,
        absences: IAbsenceFactSource,
        sickLeaves: ISickLeaveDocumentSource,
        hours: IHoursFactSource,
        presences: IPresenceRepository,
      ) =>
        new OpenPresenceUseCase(
          companies,
          employees,
          absences,
          sickLeaves,
          hours,
          presences,
        ),
      inject: [
        ICompanyRepository,
        IEmployeeDirectory,
        IAbsenceFactSource,
        ISickLeaveDocumentSource,
        IHoursFactSource,
        IPresenceRepository,
      ],
    },
    {
      provide: IListPresences,
      useFactory: (
        employees: IEmployeeDirectory,
        absences: IAbsenceFactSource,
        sickLeaves: ISickLeaveDocumentSource,
        hours: IHoursFactSource,
        presences: IPresenceRepository,
      ) =>
        new ListPresencesUseCase(
          employees,
          absences,
          sickLeaves,
          hours,
          presences,
        ),
      inject: [
        IEmployeeDirectory,
        IAbsenceFactSource,
        ISickLeaveDocumentSource,
        IHoursFactSource,
        IPresenceRepository,
      ],
    },
  ],
})
export class PresenceModule {}
