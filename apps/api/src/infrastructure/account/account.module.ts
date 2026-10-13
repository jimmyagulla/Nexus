import { Module } from '@nestjs/common';
import {
  InMemoryAccountRepository,
  localDevAccount,
} from '@hexagonal-monorepo-template/adapters';
import { IAccountRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaAccountRepository } from '../../adapters/out/account/prisma-account.repository';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  providers: [
    {
      provide: IAccountRepository,
      useFactory: (config: ApiConfig, prisma?: PrismaDb) => {
        if (config.persistence === 'postgres' && prisma !== undefined) {
          return new PrismaAccountRepository(prisma);
        }
        if (config.authDisabled) {
          const account = localDevAccount();
          return new InMemoryAccountRepository(
            new Map([[account.id, account]]),
          );
        }
        return new InMemoryAccountRepository();
      },
      inject: [API_CONFIG, { token: IPrismaDb, optional: true }],
    },
  ],
  exports: [IAccountRepository],
})
export class AccountModule {}
