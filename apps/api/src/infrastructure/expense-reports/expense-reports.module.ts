import { Module } from '@nestjs/common';
import {
  ChangeExpenseReportStatusUseCase,
  ListEmployeeExpenseReportsUseCase,
  ListExpenseReportsUseCase,
  ReviseExpenseReportUseCase,
  SubmitExpenseReportUseCase,
  ViewExpenseReportProofUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryExpenseReportProofStorage,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IChangeExpenseReportStatus,
  IClock,
  IExpenseReportProofStorage,
  IExpenseReportRepository,
  IIdGenerator,
  IListEmployeeExpenseReports,
  IListExpenseReports,
  IReviseExpenseReport,
  ISubmitExpenseReport,
  IViewExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';
import { EmployerExpenseReportsController } from '../../adapters/http/expense-reports/employer-expense-reports.controller';
import { ExpenseReportsController } from '../../adapters/http/expense-reports/expense-reports.controller';
import { PrismaExpenseReportRepository } from '../../adapters/out/expense-reports/prisma-expense-report.repository';
import { SupabaseExpenseReportProofStorage } from '../../adapters/out/expense-reports/supabase-expense-report-proof.storage';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [ExpenseReportsController, EmployerExpenseReportsController],
  providers: [
    {
      provide: IExpenseReportRepository,
      useFactory: (config: ApiConfig, ids: IIdGenerator, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaExpenseReportRepository(prisma);
        }
        return new InMemoryExpenseReportRepository(ids);
      },
      inject: [API_CONFIG, IIdGenerator, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IExpenseReportProofStorage,
      useFactory: (config: ApiConfig, ids: IIdGenerator) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabaseExpenseReportProofStorage(
            {
              url: config.supabaseUrl,
              serviceRoleKey: config.supabaseServiceRoleKey,
            },
            ids,
          );
        }
        return new InMemoryExpenseReportProofStorage(ids);
      },
      inject: [API_CONFIG, IIdGenerator],
    },
    {
      provide: IListExpenseReports,
      useFactory: (reports: IExpenseReportRepository, clock: IClock) =>
        new ListExpenseReportsUseCase(reports, clock),
      inject: [IExpenseReportRepository, IClock],
    },
    {
      provide: IListEmployeeExpenseReports,
      useFactory: (reports: IExpenseReportRepository, clock: IClock) =>
        new ListEmployeeExpenseReportsUseCase(reports, clock),
      inject: [IExpenseReportRepository, IClock],
    },
    {
      provide: ISubmitExpenseReport,
      useFactory: (
        reports: IExpenseReportRepository,
        proofs: IExpenseReportProofStorage,
        clock: IClock,
      ) => new SubmitExpenseReportUseCase(reports, proofs, clock),
      inject: [IExpenseReportRepository, IExpenseReportProofStorage, IClock],
    },
    {
      provide: IReviseExpenseReport,
      useFactory: (reports: IExpenseReportRepository, proofs: IExpenseReportProofStorage) =>
        new ReviseExpenseReportUseCase(reports, proofs),
      inject: [IExpenseReportRepository, IExpenseReportProofStorage],
    },
    {
      provide: IViewExpenseReportProof,
      useFactory: (reports: IExpenseReportRepository, proofs: IExpenseReportProofStorage) =>
        new ViewExpenseReportProofUseCase(reports, proofs),
      inject: [IExpenseReportRepository, IExpenseReportProofStorage],
    },
    {
      provide: IChangeExpenseReportStatus,
      useFactory: (reports: IExpenseReportRepository, clock: IClock) =>
        new ChangeExpenseReportStatusUseCase(reports, clock),
      inject: [IExpenseReportRepository, IClock],
    },
  ],
})
export class ExpenseReportsModule {}
