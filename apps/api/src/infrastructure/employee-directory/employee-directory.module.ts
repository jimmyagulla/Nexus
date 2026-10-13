import { Module } from '@nestjs/common';
import {
  InMemoryEmployeeDirectory,
  localDevEmployees,
} from '@hexagonal-monorepo-template/adapters';
import { IEmployeeDirectory } from '@hexagonal-monorepo-template/ports';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';

@Module({
  providers: [
    {
      provide: IEmployeeDirectory,
      useFactory: (config: ApiConfig) =>
        new InMemoryEmployeeDirectory(
          config.authDisabled ? localDevEmployees() : [],
        ),
      inject: [API_CONFIG],
    },
  ],
  exports: [IEmployeeDirectory],
})
export class EmployeeDirectoryModule {}
