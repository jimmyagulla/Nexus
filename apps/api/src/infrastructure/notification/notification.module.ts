import { Module } from '@nestjs/common';
import { InMemoryNotificationRepository } from '@hexagonal-monorepo-template/adapters';
import { INotificationRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaNotificationRepository } from '../../adapters/out/notification/prisma-notification.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: INotificationRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaNotificationRepository(prisma);
        }
        return new InMemoryNotificationRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
  ],
  exports: [INotificationRepository],
})
export class NotificationModule {}
