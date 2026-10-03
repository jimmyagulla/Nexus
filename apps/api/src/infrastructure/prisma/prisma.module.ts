import { Global, Module } from '@nestjs/common';
import { PrismaClient } from './prisma-client';
import { IPrismaDb } from './prisma-db.port';

@Global()
@Module({
  providers: [
    {
      provide: IPrismaDb,
      useFactory: () => new PrismaClient(),
    },
  ],
  exports: [IPrismaDb],
})
export class PrismaModule {}
