import { Module } from '@nestjs/common';
import {
  AddExpenseUseCase,
  AttachReceiptUseCase,
  CreateExpenseReportUseCase,
  GetExpenseReportIndicatorsUseCase,
  GetExpenseReportUseCase,
  GetReceiptUseCase,
  ListExpenseReportsUseCase,
  OpenExpenseReportUseCase,
  RefuseExpenseReportUseCase,
  ReimburseExpenseReportUseCase,
  RequestExpenseReportInformationUseCase,
  ValidateExpenseReportUseCase,
  RemoveExpenseUseCase,
  SubmitExpenseReportUseCase,
  UpdateExpenseUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAddExpense,
  IAttachReceipt,
  ICreateExpenseReport,
  IEmployeeRepository,
  IExpenseCategoryRepository,
  IExpenseReportRepository,
  IClock,
  INotificationRepository,
  IGetExpenseReport,
  IGetExpenseReportIndicators,
  IGetReceipt,
  IListExpenseReports,
  IOpenExpenseReport,
  IRefuseExpenseReport,
  IReimburseExpenseReport,
  IRequestExpenseReportInformation,
  IValidateExpenseReport,
  IRemoveExpense,
  ISubmitExpenseReport,
  IUpdateExpense,
} from '@hexagonal-monorepo-template/ports';
import { ExpenseReportController } from '../../adapters/http/expense-report/expense-report.controller';
import { PrismaExpenseReportRepository } from '../../adapters/out/expense-report/prisma-expense-report.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { EmployeeModule } from '../employee/employee.module';
import { ExpenseCategoryModule } from '../expense-category/expense-category.module';
import { NotificationModule } from '../notification/notification.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [EmployeeModule, ExpenseCategoryModule, NotificationModule],
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
      provide: IUpdateExpense,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
        categories: IExpenseCategoryRepository,
      ) => new UpdateExpenseUseCase(employees, reports, categories),
      inject: [
        IEmployeeRepository,
        IExpenseReportRepository,
        IExpenseCategoryRepository,
      ],
    },
    {
      provide: IRemoveExpense,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
      ) => new RemoveExpenseUseCase(employees, reports),
      inject: [IEmployeeRepository, IExpenseReportRepository],
    },
    {
      provide: IAttachReceipt,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
      ) => new AttachReceiptUseCase(employees, reports),
      inject: [IEmployeeRepository, IExpenseReportRepository],
    },
    {
      provide: ISubmitExpenseReport,
      useFactory: (
        employees: IEmployeeRepository,
        reports: IExpenseReportRepository,
        notifications: INotificationRepository,
        clock: IClock,
      ) =>
        new SubmitExpenseReportUseCase(employees, reports, notifications, clock),
      inject: [
        IEmployeeRepository,
        IExpenseReportRepository,
        INotificationRepository,
        IClock,
      ],
    },
    {
      provide: IOpenExpenseReport,
      useFactory: (reports: IExpenseReportRepository) =>
        new OpenExpenseReportUseCase(reports),
      inject: [IExpenseReportRepository],
    },
    {
      provide: IRequestExpenseReportInformation,
      useFactory: (
        reports: IExpenseReportRepository,
        notifications: INotificationRepository,
        clock: IClock,
      ) =>
        new RequestExpenseReportInformationUseCase(
          reports,
          notifications,
          clock,
        ),
      inject: [IExpenseReportRepository, INotificationRepository, IClock],
    },
    {
      provide: IValidateExpenseReport,
      useFactory: (
        reports: IExpenseReportRepository,
        notifications: INotificationRepository,
        clock: IClock,
      ) => new ValidateExpenseReportUseCase(reports, notifications, clock),
      inject: [IExpenseReportRepository, INotificationRepository, IClock],
    },
    {
      provide: IRefuseExpenseReport,
      useFactory: (
        reports: IExpenseReportRepository,
        notifications: INotificationRepository,
        clock: IClock,
      ) => new RefuseExpenseReportUseCase(reports, notifications, clock),
      inject: [IExpenseReportRepository, INotificationRepository, IClock],
    },
    {
      provide: IReimburseExpenseReport,
      useFactory: (
        reports: IExpenseReportRepository,
        notifications: INotificationRepository,
        clock: IClock,
      ) => new ReimburseExpenseReportUseCase(reports, notifications, clock),
      inject: [IExpenseReportRepository, INotificationRepository, IClock],
    },
    {
      provide: IGetExpenseReportIndicators,
      useFactory: (reports: IExpenseReportRepository) =>
        new GetExpenseReportIndicatorsUseCase(reports),
      inject: [IExpenseReportRepository],
    },
    {
      provide: IGetReceipt,
      useFactory: (reports: IExpenseReportRepository) =>
        new GetReceiptUseCase(reports),
      inject: [IExpenseReportRepository],
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
