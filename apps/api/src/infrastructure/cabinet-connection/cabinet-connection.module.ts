import { Module } from '@nestjs/common';
import {
  InMemoryCabinetConnectionRepository,
  LOCAL_DEV_COMPANY_ID,
} from '@hexagonal-monorepo-template/adapters';
import {
  CabinetConnection,
  CabinetConnectionStatus,
} from '@hexagonal-monorepo-template/domain';
import { ICabinetConnectionRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaCabinetConnectionRepository } from '../../adapters/out/cabinet-connection/prisma-cabinet-connection.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: ICabinetConnectionRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaCabinetConnectionRepository(prisma);
        }
        if (config.authDisabled) {
          return new InMemoryCabinetConnectionRepository(
            new Map([
              [
                LOCAL_DEV_COMPANY_ID,
                new CabinetConnection(
                  LOCAL_DEV_COMPANY_ID,
                  CabinetConnectionStatus.CONNECTED,
                ),
              ],
            ]),
          );
        }
        return new InMemoryCabinetConnectionRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
  ],
  exports: [ICabinetConnectionRepository],
})
export class CabinetConnectionModule {}
