import { Module } from '@nestjs/common';
import {
  CreateCabinetExchangeDraftUseCase,
  DownloadCabinetExchangeFileUseCase,
  ListCabinetExchangesUseCase,
  MarkCabinetExchangeToTransmitUseCase,
  OpenCabinetExchangeUseCase,
  TransmitCabinetExchangesUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryCabinetExchangeRepository,
  InMemoryExchangeFileStorage,
} from '@hexagonal-monorepo-template/adapters';
import {
  ICabinetConnectionRepository,
  ICabinetExchangeRepository,
  IClock,
  ICreateCabinetExchangeDraft,
  IDownloadCabinetExchangeFile,
  IExchangeFileStorage,
  IListCabinetExchanges,
  IMarkCabinetExchangeToTransmit,
  IOpenCabinetExchange,
  ITransmitCabinetExchanges,
} from '@hexagonal-monorepo-template/ports';
import { CabinetExchangeController } from '../../adapters/http/cabinet-exchange/cabinet-exchange.controller';
import { PrismaCabinetExchangeRepository } from '../../adapters/out/cabinet-exchange/prisma-cabinet-exchange.repository';
import { PrismaExchangeFileStorage } from '../../adapters/out/cabinet-exchange/prisma-exchange-file.storage';
import { CabinetConnectionModule } from '../cabinet-connection/cabinet-connection.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [CabinetConnectionModule],
  controllers: [CabinetExchangeController],
  providers: [
    {
      provide: ICabinetExchangeRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaCabinetExchangeRepository(prisma);
        }
        return new InMemoryCabinetExchangeRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: IExchangeFileStorage,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaExchangeFileStorage(prisma);
        }
        return new InMemoryExchangeFileStorage();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
    {
      provide: ICreateCabinetExchangeDraft,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        files: IExchangeFileStorage,
        clock: IClock,
      ) => new CreateCabinetExchangeDraftUseCase(exchanges, files, clock),
      inject: [ICabinetExchangeRepository, IExchangeFileStorage, IClock],
    },
    {
      provide: IMarkCabinetExchangeToTransmit,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        files: IExchangeFileStorage,
      ) => new MarkCabinetExchangeToTransmitUseCase(exchanges, files),
      inject: [ICabinetExchangeRepository, IExchangeFileStorage],
    },
    {
      provide: ITransmitCabinetExchanges,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        files: IExchangeFileStorage,
        connections: ICabinetConnectionRepository,
        clock: IClock,
      ) =>
        new TransmitCabinetExchangesUseCase(
          exchanges,
          files,
          connections,
          clock,
        ),
      inject: [
        ICabinetExchangeRepository,
        IExchangeFileStorage,
        ICabinetConnectionRepository,
        IClock,
      ],
    },
    {
      provide: IListCabinetExchanges,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        connections: ICabinetConnectionRepository,
      ) => new ListCabinetExchangesUseCase(exchanges, connections),
      inject: [ICabinetExchangeRepository, ICabinetConnectionRepository],
    },
    {
      provide: IOpenCabinetExchange,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        connections: ICabinetConnectionRepository,
        clock: IClock,
      ) => new OpenCabinetExchangeUseCase(exchanges, connections, clock),
      inject: [ICabinetExchangeRepository, ICabinetConnectionRepository, IClock],
    },
    {
      provide: IDownloadCabinetExchangeFile,
      useFactory: (
        exchanges: ICabinetExchangeRepository,
        files: IExchangeFileStorage,
        connections: ICabinetConnectionRepository,
        clock: IClock,
      ) =>
        new DownloadCabinetExchangeFileUseCase(
          exchanges,
          files,
          connections,
          clock,
        ),
      inject: [
        ICabinetExchangeRepository,
        IExchangeFileStorage,
        ICabinetConnectionRepository,
        IClock,
      ],
    },
  ],
})
export class CabinetExchangeModule {}
