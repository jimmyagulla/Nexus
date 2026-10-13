import { Module } from '@nestjs/common';
import {
  AddExpenseUseCase,
  CreateExpenseReportUseCase,
  GetExpenseReportUseCase,
  ListExpenseReportsUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddExpense,
  ICreateExpenseReport,
  IEmployeeRepository,
  IExpenseCategoryRepository,
  IExpenseReportRepository,
  IGetExpenseReport,
  IListExpenseReports,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseReportController } from '../../adapters/http/expense-report/expense-report.controller';
import { PrismaExpenseReportRepository } from '../../adapters/out/expense-report/prisma-expense-report.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { EmployeeModule } from '../employee/employee.module';
import { ExpenseCategoryModule } from '../expense-category/expense-category.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [EmployeeModule, ExpenseCategoryModule],
  controllers: [ExpenseReportController],
  providers: [
    {
      provide: IExpenseReportRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaExpenseReportRepository(prisma);
        }
        return new InMemoryExpenseReportRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: ICreateExpenseReport,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
      ) => new CreateExpenseReportUseCase(employees, reports),
      inject: [IEmployeeRepository, IExpenseReportRepository],
    },
    {
      provide: IAddExpense,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
        categories: IExpenseCategoryRepository,
      ) => new AddExpenseUseCase(employees, reports, categories),
      inject: [
        IEmployeeRepository,
        IExpenseReportRepository,
        IExpenseCategoryRepository,
      ],
    },
    {
      provide: IGetExpenseReport,
      useFactory: (reports: IExpenseReportRepository) =>
        new GetExpenseReportUseCase(reports),
      inject: [IExpenseReportRepository],
    },
    {
      provide: IListExpenseReports,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
      ) => new ListExpenseReportsUseCase(employees, reports),
      inject: [IEmployeeRepository, IExpenseReportRepository],
    },
  ],
})
export class ExpenseReportModule {}
