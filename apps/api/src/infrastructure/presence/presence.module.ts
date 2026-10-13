import { Module } from '@nestjs/common';
import {
  ListPresencesUseCase,
  OpenPresenceUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryPresenceRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IEmployeeDirectory,
  IListPresences,
  IOpenPresence,
  IPresenceRepository,
} from '@hexagonal-monorepo-template/ports';
import { PresenceController } from '../../adapters/http/presence/presence.controller';
import { PrismaPresenceRepository } from '../../adapters/out/presence/prisma-presence.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { EmployeeDirectoryModule } from '../employee-directory/employee-directory.module';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [EmployeeDirectoryModule],
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
        employees: IEmployeeDirectory,
        presences: IPresenceRepository,
      ) => new OpenPresenceUseCase(employees, presences),
      inject: [IEmployeeDirectory, IPresenceRepository],
    },
    {
      provide: IListPresences,
      useFactory: (
        employees: IEmployeeDirectory,
        presences: IPresenceRepository,
      ) => new ListPresencesUseCase(employees, presences),
      inject: [IEmployeeDirectory, IPresenceRepository],
    },
  ],
})
export class PresenceModule {}
