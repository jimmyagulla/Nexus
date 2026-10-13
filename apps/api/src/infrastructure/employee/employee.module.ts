import { Module } from '@nestjs/common';
import { InviteEmployeeUseCase } from '@hexagonal-monorepo-template/application';
import {
  InMemoryEmployeeRepository,
  localDevEmployee,
} from '@hexagonal-monorepo-template/adapters';
import {
  IAccountRepository,
  IEmployeeRepository,
  IIdGenerator,
  IInviteEmployee,
} from '@hexagonal-monorepo-template/ports';
import { EmployeeController } from '../../adapters/http/employee/employee.controller';
import { PrismaEmployeeRepository } from '../../adapters/out/employee/prisma-employee.repository';
import { AccountModule } from '../account/account.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [AccountModule],
  controllers: [EmployeeController],
  providers: [
    {
      provide: IEmployeeRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaEmployeeRepository(prisma);
        }
        if (config.authDisabled) {
          const employee = localDevEmployee();
          return new InMemoryEmployeeRepository(
            new Map([[employee.id, employee]]),
          );
        }
        return new InMemoryEmployeeRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IInviteEmployee,
      useFactory: (
        employees: IEmployeeRepository,
        accounts: IAccountRepository,
        ids: IIdGenerator,
      ) => new InviteEmployeeUseCase(employees, accounts, ids),
      inject: [IEmployeeRepository, IAccountRepository, IIdGenerator],
    },
  ],
  exports: [IEmployeeRepository],
})
export class EmployeeModule {}
