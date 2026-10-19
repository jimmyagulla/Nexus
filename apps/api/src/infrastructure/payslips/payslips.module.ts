import { Module } from '@nestjs/common';
import {
  DownloadPayslipUseCase,
  ExportPayslipsUseCase,
  ListPayslipsUseCase,
  ViewPayslipUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryPayslipFileStorage,
  InMemoryPayslipRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  IDownloadPayslip,
  IExportPayslips,
  IListPayslips,
  IPayslipFileStorage,
  IPayslipRepository,
  IViewPayslip,
} from '@hexagonal-monorepo-template/ports';
import { PayslipsController } from '../../adapters/http/payslips/payslips.controller';
import { PrismaPayslipRepository } from '../../adapters/out/payslips/prisma-payslip.repository';
import { SupabasePayslipFileStorage } from '../../adapters/out/payslips/supabase-payslip-file.storage';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [PayslipsController],
  providers: [
    {
      provide: IPayslipRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaPayslipRepository(prisma);
        }
        return new InMemoryPayslipRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IPayslipFileStorage,
      useFactory: (config: ApiConfig) => {
        if (
          config.supabaseUrl !== undefined &&
          config.supabaseServiceRoleKey !== undefined
        ) {
          return new SupabasePayslipFileStorage({
            url: config.supabaseUrl,
            serviceRoleKey: config.supabaseServiceRoleKey,
          });
        }
        return new InMemoryPayslipFileStorage();
      },
      inject: [API_CONFIG],
    },
    {
      provide: IListPayslips,
      useFactory: (payslips: IPayslipRepository) => new ListPayslipsUseCase(payslips),
      inject: [IPayslipRepository],
    },
    {
      provide: IViewPayslip,
      useFactory: (payslips: IPayslipRepository, files: IPayslipFileStorage) =>
        new ViewPayslipUseCase(payslips, files),
      inject: [IPayslipRepository, IPayslipFileStorage],
    },
    {
      provide: IDownloadPayslip,
      useFactory: (payslips: IPayslipRepository, files: IPayslipFileStorage) =>
        new DownloadPayslipUseCase(payslips, files),
      inject: [IPayslipRepository, IPayslipFileStorage],
    },
    {
      provide: IExportPayslips,
      useFactory: (payslips: IPayslipRepository, files: IPayslipFileStorage) =>
        new ExportPayslipsUseCase(payslips, files),
      inject: [IPayslipRepository, IPayslipFileStorage],
    },
  ],
})
export class PayslipsModule {}
