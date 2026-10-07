import { Global, Module } from '@nestjs/common';
import { PrismaClient } from './prisma-client';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb } from './prisma-db.port';

@Global()
@Module({
  providers: [
    {
      provide: IPrismaDb,
      useFactory: (config: ApiConfig) =>
        new PrismaClient({
          datasources: {
            db: { url: config.databaseUrl },
          },
        }),
      inject: [API_CONFIG],
    },
  ],
  exports: [IPrismaDb],
})
export class PrismaModule {}
