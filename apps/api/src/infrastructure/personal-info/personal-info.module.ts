import { Module } from '@nestjs/common';
import {
  GetPersonalInfoUseCase,
  UpdatePersonalContactUseCase,
} from '@hexagonal-monorepo-template/application';
import { InMemoryPersonalInfoRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IClock,
  IGetPersonalInfo,
  IPersonalInfoRepository,
  IUpdatePersonalContact,
} from '@hexagonal-monorepo-template/ports';
import { PersonalInfoController } from '../../adapters/http/personal-info/personal-info.controller';
import { PrismaPersonalInfoRepository } from '../../adapters/out/personal-info/prisma-personal-info.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  controllers: [PersonalInfoController],
  providers: [
    {
      provide: IPersonalInfoRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaPersonalInfoRepository(prisma);
        }
        return new InMemoryPersonalInfoRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IGetPersonalInfo,
      useFactory: (personalInfos: IPersonalInfoRepository) =>
        new GetPersonalInfoUseCase(personalInfos),
      inject: [IPersonalInfoRepository],
    },
    {
      provide: IUpdatePersonalContact,
      useFactory: (personalInfos: IPersonalInfoRepository, clock: IClock) =>
        new UpdatePersonalContactUseCase(personalInfos, clock),
      inject: [IPersonalInfoRepository, IClock],
    },
  ],
})
export class PersonalInfoModule {}
