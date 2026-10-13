import { Module } from '@nestjs/common';
import {
  ActivateAccountUseCase,
  ActivateEmployeeAccountUseCase,
  SignInUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  InMemoryAccountRepository,
  InMemorySecretHasher,
  InMemorySignInSession,
  localDevAccount,
} from '@hexagonal-monorepo-template/adapters';
import {
  IAccountRepository,
  IActivateAccount,
  IActivateEmployeeAccount,
  IAuditLogRepository,
  IClock,
  ISecretHasher,
  ISignIn,
  ISignInSession,
} from '@hexagonal-monorepo-template/ports';
import { AccountController } from '../../adapters/http/account/account.controller';
import { PrismaAccountRepository } from '../../adapters/out/account/prisma-account.repository';
import { AuditModule } from '../audit/audit.module';
import { API_CONFIG, type ApiConfig } from '../config/load-api-config';
import { IPrismaDb, type PrismaDb } from '../prisma/prisma-db.port';

@Module({
  imports: [AuditModule],
  controllers: [AccountController],
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
    {
      provide: ISecretHasher,
      useFactory: () => new InMemorySecretHasher(),
    },
    {
      provide: IActivateAccount,
      useFactory: (accounts: IAccountRepository, secrets: ISecretHasher) =>
        new ActivateAccountUseCase(accounts, secrets),
      inject: [IAccountRepository, ISecretHasher],
    },
    {
      provide: IActivateEmployeeAccount,
      useFactory: (accounts: IAccountRepository, secrets: ISecretHasher) =>
        new ActivateEmployeeAccountUseCase(accounts, secrets),
      inject: [IAccountRepository, ISecretHasher],
    },
    {
      provide: ISignInSession,
      useFactory: () => new InMemorySignInSession(),
    },
    {
      provide: ISignIn,
      useFactory: (
        accounts: IAccountRepository,
        secrets: ISecretHasher,
        sessions: ISignInSession,
        audits: IAuditLogRepository,
        clock: IClock,
      ) => new SignInUseCase(accounts, secrets, sessions, audits, clock),
      inject: [
        IAccountRepository,
        ISecretHasher,
        ISignInSession,
        IAuditLogRepository,
        IClock,
      ],
    },
  ],
  exports: [IAccountRepository],
})
export class AccountModule {}
