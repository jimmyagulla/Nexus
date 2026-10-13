import { Module } from '@nestjs/common';
import { InMemoryEmployeeRepository } from '@hexagonal-monorepo-template/adapters';
import { IEmployeeRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaEmployeeRepository } from '../../adapters/out/employee/prisma-employee.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: IEmployeeRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaEmployeeRepository(prisma);
        }
        return new InMemoryEmployeeRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
  ],
  exports: [IEmployeeRepository],
})
export class EmployeeModule {}
